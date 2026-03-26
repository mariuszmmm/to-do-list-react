const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
const dns = require("dns");
const axios = require("axios");
const path = require("path");

// Wymuszenie publicznego DNS do sprawnego działania SRV na Twoim PC
dns.setServers(['1.1.1.1', '8.8.8.8']);

// Wczytujemy dane z głównego pliku .env (ścieżka relatywna do skryptu)
dotenv.config({ path: path.join(__dirname, "../../.env") });

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DATABASE;
const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
const refreshTokenEnv = process.env.GOOGLE_BACKUP_REFRESH_TOKEN;

async function getAccessToken(client) {
  const db = client.db(dbName);
  const configCol = db.collection("systemconfigs");
  
  // 1. Check if we have a fresh access token in DB
  const accessTokenDoc = await configCol.findOne({ key: "google_drive_access_token" });
  if (accessTokenDoc && accessTokenDoc.value && accessTokenDoc.value.token) {
    const expiresAt = new Date(accessTokenDoc.value.expiresAt);
    const bufferTime = 5 * 60 * 1000;
    if (expiresAt.getTime() - Date.now() > bufferTime) {
      console.log("   ✅ Używam ważnego tokenu dostępu z bazy danych.");
      return accessTokenDoc.value.token;
    }
  }

  // 2. Need to refresh - get refresh token (DB first, then .env)
  let activeRefreshToken = refreshTokenEnv;
  const refreshTokenDoc = await configCol.findOne({ key: "google_drive_refresh_token" });
  if (refreshTokenDoc && refreshTokenDoc.value) {
    activeRefreshToken = refreshTokenDoc.value;
  }

  if (!activeRefreshToken) {
    throw new Error("Brak Refresh Tokena w .env lub w bazie danych. Musisz najpierw autoryzować Google w aplikacji.");
  }

  console.log("   🔄 Odświeżam token dostępu Google...");
  try {
    const response = await axios.post("https://oauth2.googleapis.com/token", new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: activeRefreshToken,
      grant_type: "refresh_token",
    }));

    const data = response.data;
    const newToken = data.access_token;
    const expiresAt = new Date(Date.now() + (data.expires_in || 3600) * 1000);

    // Save back to DB
    await configCol.updateOne(
      { key: "google_drive_access_token" },
      { $set: { value: { token: newToken, expiresAt }, updatedAt: new Date() } },
      { upsert: true }
    );

    return newToken;
  } catch (err) {
    console.error("   ❌ Błąd odświeżania tokena:", err.response?.data || err.message);
    return null;
  }
}

async function findOrCreateFolder(folderName, accessToken, parentId = null) {
  const parentQuery = parentId ? ` and '${parentId}' in parents` : " and 'root' in parents";
  const query = `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false${parentQuery}`;
  
  const searchRes = await axios.get(`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name)`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  const files = searchRes.data.files || [];
  if (files.length > 0) {
    if (files.length > 1) {
      console.warn(`   ⚠️  Uwaga: Znaleziono ${files.length} folderów o nazwie "${folderName}". Używam pierwszego (ID: ${files[0].id}).`);
    } else {
      console.log(`   📂 Znaleziono folder "${folderName}" (ID: ${files[0].id}).`);
    }
    return files[0].id;
  }

  console.log(`   🆕 Tworzę nowy folder "${folderName}"...`);
  const createRes = await axios.post("https://www.googleapis.com/drive/v3/files", {
    name: folderName,
    mimeType: "application/vnd.google-apps.folder",
    parents: parentId ? [parentId] : ["root"]
  }, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  console.log(`   ✅ Utworzono folder "${folderName}" (ID: ${createRes.data.id}).`);
  return createRes.data.id;
}

async function uploadFile(fileName, content, accessToken) {
  console.log("\n📦 Lokalizowanie folderów na Dysku Google...");
  const rootFolderId = await findOrCreateFolder("To-do-list_Backups", accessToken);
  const targetFolderId = await findOrCreateFolder("Manual-Backup", accessToken, rootFolderId);

  const fileMetadata = {
    name: fileName,
    mimeType: "application/json",
    parents: [targetFolderId]
  };

  const boundary = "===============7330845974216740156==";
  const multipartBody = 
    `--${boundary}\r\n` +
    `Content-Type: application/json; charset=UTF-8\r\n\r\n` +
    JSON.stringify(fileMetadata) +
    `\r\n--${boundary}\r\n` +
    `Content-Type: application/json\r\n\r\n` +
    content +
    `\r\n--${boundary}--`;

  const response = await axios.post("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", multipartBody, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": `multipart/related; boundary="${boundary}"`
    }
  });

  return response.data;
}

async function backupToDrive() {
  console.log("=========================================================================");
  console.log("💾  NARZĘDZIE DO KOPII ZAPASOWEJ MONGODB -> GOOGLE DRIVE ☁️");
  console.log("=========================================================================");

  if (!uri || !dbName || !clientId || !clientSecret) {
    console.error("❌ BŁĄD: Brakuje wymaganych zmiennych GOOGLE/MONGODB w pliku .env!");
    process.exit(1);
  }

  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("✅ Połączono z bazą danych.");

    const accessToken = await getAccessToken(client);
    if (!accessToken) throw new Error("Nie udało się uzyskać tokenu dostępu do Google Drive.");

    const db = client.db(dbName);
    const collections = await db.listCollections().toArray();
    
    if (collections.length === 0) {
      console.log("⚠️ Baza jest pusta. Nie ma czego wysyłać.");
      return;
    }

    console.log(`🚀 Przygotowuję paczkę danych zgodną z systemem restore (Netlify)...`);
    
    // Fetch individual collections for mapped structure
    const allUserData = await db.collection("users").find({}).toArray();
    const allSystemConfig = await db.collection("systemconfigs").find({}).toArray();
    const allNotifications = await db.collection("notifications").find({}).toArray();

    // Dynamic dump of all collections (v1.1 feature)
    const collectionsData = {};
    for (let colInfo of collections) {
      const colName = colInfo.name;
      const docs = await db.collection(colName).find({}).toArray();
      collectionsData[colName] = docs;
      console.log(`   📦 [${colName}]: Odczytano ${docs.length} dokumentów.`);
    }

    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const day = pad(now.getDate());
    const month = pad(now.getMonth() + 1);
    const year = now.getFullYear();
    const hours = pad(now.getHours());
    const minutes = pad(now.getMinutes());
    const seconds = pad(now.getSeconds());

    const timestampStr = `${day}-${month}-${year}_${hours}-${minutes}-${seconds}`;
    const fileName = `Backup_Manual-CLI_${timestampStr}.json`;

    // Build structure identical to getAllUsersForBackup.ts
    const backupData = {
      version: "1.1",
      timestamp: now.toISOString(),
      createdBy: "CLI-Script",
      fileName,
      backupType: "all-users",
      users: allUserData.map(userData => ({
        email: userData.email,
        account: userData.account,
        googleRefreshToken: userData.googleRefreshToken,
        lists: userData.lists || [],
        listsCount: userData.lists?.length || 0,
        tasksCount: userData.lists?.reduce((sum, list) => sum + (list.taskList?.length || 0), 0) || 0,
      })),
      systemSettings: allSystemConfig
        .filter(config => config.key && !config.key.startsWith("log_"))
        .map(config => ({
          key: config.key,
          value: config.value,
          updatedAt: config.updatedAt instanceof Date ? config.updatedAt.toISOString() : new Date().toISOString(),
        })),
      systemLogs: allSystemConfig
        .filter(config => config.key && config.key.startsWith("log_"))
        .map(config => ({
          key: config.key,
          value: config.value,
          updatedAt: config.updatedAt instanceof Date ? config.updatedAt.toISOString() : new Date().toISOString(),
        })),
      notifications: allNotifications,
      collections: collectionsData, // Include for completeness
      totalUsers: allUserData.length,
    };

    const jsonContent = JSON.stringify(backupData, null, 2);

    console.log(`\n☁️  Przesyłam plik [${fileName}] na Dysk Google...`);
    const result = await uploadFile(fileName, jsonContent, accessToken);
    
    console.log("\n🎉 KOPIA ZAPASOWA PRZESŁANA POMYŚLNIE!");
    console.log(`🆔 ID pliku w chmurze: ${result.id}`);
    console.log(`📢 Struktura pliku jest teraz w pełni kompatybilna z funkcją Restore na stronie.`);

  } catch (error) {
    console.error("\n❌ BŁĄD:", error.message || error);
  } finally {
    await client.close();
    console.log("🔌 Połączenie zamknięte.");
  }
}

backupToDrive();
