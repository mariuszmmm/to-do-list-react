const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
const dns = require("dns");
const axios = require("axios");
const path = require("path");
const readline = require("readline");

// Wymuszenie publicznego DNS do sprawnego działania SRV na Twoim PC
dns.setServers(['1.1.1.1', '8.8.8.8']);

// Wczytujemy dane z głównego pliku .env (ścieżka relatywna do skryptu)
dotenv.config({ path: path.join(__dirname, "../../.env") });

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DATABASE;
const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
const refreshTokenEnv = process.env.GOOGLE_BACKUP_REFRESH_TOKEN;

function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans.toLowerCase());
    }),
  );
}

async function getAccessToken(client) {
  const db = client.db(dbName);
  const configCol = db.collection("systemconfigs");
  
  const accessTokenDoc = await configCol.findOne({ key: "google_drive_access_token" });
  if (accessTokenDoc && accessTokenDoc.value && accessTokenDoc.value.token) {
    const expiresAt = new Date(accessTokenDoc.value.expiresAt);
    if (expiresAt.getTime() - Date.now() > 300000) {
      return accessTokenDoc.value.token;
    }
  }

  let activeRefreshToken = refreshTokenEnv;
  const refreshTokenDoc = await configCol.findOne({ key: "google_drive_refresh_token" });
  if (refreshTokenDoc && refreshTokenDoc.value) {
    activeRefreshToken = refreshTokenDoc.value;
  }

  if (!activeRefreshToken) throw new Error("Brak Refresh Tokena.");

  const response = await axios.post("https://oauth2.googleapis.com/token", new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: activeRefreshToken,
    grant_type: "refresh_token",
  }));

  const newToken = response.data.access_token;
  const expiresAt = new Date(Date.now() + (response.data.expires_in || 3600) * 1000);

  await configCol.updateOne(
    { key: "google_drive_access_token" },
    { $set: { value: { token: newToken, expiresAt }, updatedAt: new Date() } },
    { upsert: true }
  );

  return newToken;
}

async function listBackups(accessToken) {
  // 1. Znajdź główny folder
  const rootSearch = await axios.get(`https://www.googleapis.com/drive/v3/files?q=name='To-do-list_Backups' and trashed=false&fields=files(id)`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  if (!rootSearch.data.files.length) return [];
  
  const rootId = rootSearch.data.files[0].id;

  // 2. Znajdź podfoldery Manual-Backup oraz Auto-Backup
  const folderNames = ['Manual-Backup', 'Auto-Backup'];
  let allFiles = [];

  for (const folderName of folderNames) {
    const subSearch = await axios.get(`https://www.googleapis.com/drive/v3/files?q=name='${folderName}' and '${rootId}' in parents and trashed=false&fields=files(id)`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    
    if (subSearch.data.files.length) {
      const folderId = subSearch.data.files[0].id;
      // 3. Listuj pliki w danym folderze
      const fileSearch = await axios.get(`https://www.googleapis.com/drive/v3/files?q='${folderId}' in parents and trashed=false&fields=files(id,name,createdTime)&orderBy=createdTime desc`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      
      const filesWithCategory = (fileSearch.data.files || []).map(f => ({
        ...f,
        category: folderName === 'Manual-Backup' ? 'Ręczny' : 'Automat'
      }));
      allFiles = allFiles.concat(filesWithCategory);
    }
  }

  // 4. Sortuj wszystkie pliki od najnowszego
  allFiles.sort((a, b) => new Date(b.createdTime) - new Date(a.createdTime));

  return allFiles;
}

async function downloadBackup(fileId, accessToken) {
  const response = await axios.get(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  return response.data;
}

async function restoreFromDrive() {
  console.log("=========================================================================");
  console.log("🛠️  PRZYWRACANIE MONGODB Z DYSKU GOOGLE ☁️ -> 💾");
  console.log("=========================================================================");

  if (!uri || !dbName || !clientId || !clientSecret) {
    console.error("❌ BŁĄD: Brakuje zmiennych GOOGLE/MONGODB w pliku .env!");
    process.exit(1);
  }

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const accessToken = await getAccessToken(client);

    console.log("🔍 Szukam kopii zapasowych (Manual oraz Auto) na Dysku Google...");
    const backups = await listBackups(accessToken);

    if (backups.length === 0) {
      console.log("❌ Nie znaleziono żadnych kopii w folderach Manual-Backup/Auto-Backup.");
      return;
    }

    console.log("\nDostępne kopie zapasowe (od najnowszej):");
    backups.forEach((b, i) => {
      const typeLabel = `[${b.category}]`.padEnd(10);
      console.log(`[${i + 1}] ${typeLabel} ${b.name} (${new Date(b.createdTime).toLocaleString()})`);
    });

    const choiceIdx = await askQuestion("\n👉 Wybierz numer kopii do przywrócenia (lub 'n' aby anulować): ");
    const selectedFile = backups[parseInt(choiceIdx) - 1];

    if (!selectedFile) {
      console.log("🛑 Anulowano.");
      return;
    }

    console.log(`\n⏳ Pobieram plik: ${selectedFile.name}...`);
    const backupData = await downloadBackup(selectedFile.id, accessToken);

    if (!backupData.collections) {
      throw new Error("Pobrany plik nie zawiera pola 'collections'. Czy to na pewno plik kopii zapasowej?");
    }

    console.log(`\n⚠️ OSTRZEŻENIE: Przywrócenie kopii nadpisze dane w bazie: ${dbName}!`);
    const confirm = await askQuestion(`❓ Czy na pewno kontynuować? (t/n): `);

    if (confirm !== "t" && confirm !== "tak" && confirm !== "y" && confirm !== "yes") {
      console.log("🛑 Operacja anulowana.");
      return;
    }

    const db = client.db(dbName);
    console.log("\n🚀 Rozpoczynam przywracanie...");

    for (const [colName, docs] of Object.entries(backupData.collections)) {
      if (Array.isArray(docs) && docs.length > 0) {
        console.log(`   📦 Przywracam: [${colName}] (${docs.length} dok.)`);
        await db.collection(colName).deleteMany({});
        await db.collection(colName).insertMany(docs);
      } else {
        console.log(`   ⏭️ Pomijam [${colName}] (brak danych)`);
      }
    }

    console.log("\n🎉 PRZYWRACANIE Z DYSKU GOOGLE ZAKOŃCZONE SUKCESEM!");

  } catch (error) {
    console.error("\n❌ BŁĄD:", error.message || error);
  } finally {
    await client.close();
    console.log("🔌 Połączenie zamknięte.");
  }
}

restoreFromDrive();
