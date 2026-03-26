const cloudinary = require('cloudinary').v2;
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
const dns = require("dns");
const axios = require("axios");
const path = require("path");
const fs = require("fs");
const archiver = require("archiver");

// Wymuszenie publicznego DNS do sprawnego działania SRV na Twoim PC
dns.setServers(['1.1.1.1', '8.8.8.8']);

// Wczytujemy dane z głównego pliku .env (ścieżka relatywna do skryptu)
dotenv.config({ path: path.join(__dirname, "../../.env") });

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DATABASE;
const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
const refreshTokenEnv = process.env.GOOGLE_BACKUP_REFRESH_TOKEN;

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

/**
 * Pobiera aktualny token dostępu Google Drive (z bazy lub odświeża)
 * Replikacja logiki z backup-db-google-drive.js dla spójności.
 */
async function getAccessToken(client) {
  const db = client.db(dbName);
  const configCol = db.collection("systemconfigs");
  
  // 1. Sprawdzenie czy mamy świeży token w DB
  const accessTokenDoc = await configCol.findOne({ key: "google_drive_access_token" });
  if (accessTokenDoc && accessTokenDoc.value && accessTokenDoc.value.token) {
    const expiresAt = new Date(accessTokenDoc.value.expiresAt);
    const bufferTime = 5 * 60 * 1000;
    if (expiresAt.getTime() - Date.now() > bufferTime) {
      console.log("   ✅ Używam ważnego tokenu dostępu z bazy danych.");
      return accessTokenDoc.value.token;
    }
  }

  // 2. Potrzeba odświeżenia - pobierz refresh token (DB najpierw, potem .env)
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

    // Zapisz z powrotem do DB
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

/**
 * Szuka folderu na Google Drive lub tworzy go jeśli nie istnieje.
 */
async function findOrCreateFolder(folderName, accessToken, parentId = null) {
  const parentQuery = parentId ? ` and '${parentId}' in parents` : " and 'root' in parents";
  const query = `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false${parentQuery}`;
  
  const searchRes = await axios.get(`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name)`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  const files = searchRes.data.files || [];
  if (files.length > 0) {
    console.log(`   📂 Znaleziono folder "${folderName}" (ID: ${files[0].id}).`);
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

/**
 * Wysyła plik na Google Drive wykorzystując Resumable Upload (lepsze dla dużych archiwów ZIP)
 */
async function uploadFileToDrive(filePath, fileName, accessToken) {
  console.log("\n📦 Lokalizowanie folderów na Dysku Google...");
  const rootFolderId = await findOrCreateFolder("To-do-list_Backups", accessToken);
  const targetFolderId = await findOrCreateFolder("Cloudinary-Backups", accessToken, rootFolderId);

  const stats = fs.statSync(filePath);
  const fileSize = stats.size;

  console.log(`\n☁️  Przygotowuję wysyłkę pliku [${fileName}] (${(fileSize / 1024 / 1024).toFixed(2)} MB)...`);

  // Init resumable upload
  const initResponse = await axios.post(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable",
    {
      name: fileName,
      parents: [targetFolderId]
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json; charset=UTF-8",
        "X-Upload-Content-Length": fileSize,
        "X-Upload-Content-Type": "application/zip"
      }
    }
  );

  const uploadUrl = initResponse.headers.location;

  // Upload the file stream
  const fileStream = fs.createReadStream(filePath);
  const uploadResponse = await axios.put(uploadUrl, fileStream, {
    headers: {
      "Content-Length": fileSize,
      "Content-Type": "application/zip"
    },
    maxContentLength: Infinity,
    maxBodyLength: Infinity
  });

  return uploadResponse.data;
}

async function downloadToStream(url) {
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream'
  });
  return response.data;
}

async function backupCloudinaryToDrive() {
  console.log("=========================================================================");
  console.log("💾  KOPIA ZAPASOWA CLOUDINARY -> GOOGLE DRIVE ☁️");
  console.log("=========================================================================");

  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error('❌ BŁĄD: Brak danych logowania do Cloudinary w .env.');
    return;
  }

  const client = new MongoClient(uri);
  const zipPath = path.join(__dirname, `Cloudinary_Backup_${new Date().toISOString().replace(/[:.]/g, '-')}.zip`);
  
  try {
    await client.connect();
    console.log("✅ Połączono z bazą danych (tokeny).");

    const accessToken = await getAccessToken(client);
    if (!accessToken) throw new Error("Nie udało się uzyskać tokenu dostępu do Google Drive.");

    console.log("🚀 Skanowanie zasobów Cloudinary...");
    const resourceTypes = ['image', 'video', 'raw'];
    let allResources = [];

    for (const type of resourceTypes) {
      let nextCursor = null;
      console.log(`   Pobieram listę [${type}]...`);
      try {
        do {
          const result = await cloudinary.api.resources({
            resource_type: type,
            type: 'upload',
            max_results: 500,
            next_cursor: nextCursor,
          });
          allResources = allResources.concat(result.resources);
          nextCursor = result.next_cursor;
        } while (nextCursor);
      } catch (err) {
        if (err.http_code !== 404) {
          console.warn(`   ⚠️  Błąd listowania [${type}]:`, err.message);
        }
      }
    }

    console.log(`\n📦 Znaleziono ${allResources.length} zasobów do zarchiwizowania.`);
    
    // Tworzenie archiwum ZIP
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      console.log(`   ✅ Archiwum ZIP gotowe: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB`);
    });

    archive.on('error', (err) => { throw err; });
    archive.pipe(output);

    const metadata = [];
    let processed = 0;

    for (const resource of allResources) {
      const { public_id, format, secure_url, resource_type, asset_folder, folder } = resource;
      const destinationFolder = (asset_folder || folder || '').replace(/[<>:"|?*]/g, '_');
      
      let fileName = public_id.split('/').pop().replace(/[<>:"/\\|?*]/g, '_');
      if (format && !fileName.toLowerCase().endsWith(`.${format.toLowerCase()}`)) {
        fileName += `.${format}`;
      }

      const zipFilePath = path.join(destinationFolder, fileName);
      
      try {
        const stream = await downloadToStream(secure_url);
        archive.append(stream, { name: zipFilePath });
        
        metadata.push({
          public_id,
          resource_type,
          format,
          url: secure_url,
          asset_folder: destinationFolder,
          display_name: resource.display_name || '',
          zip_path: zipFilePath
        });

        processed++;
        if (processed % 10 === 0 || processed === allResources.length) {
          process.stdout.write(`\r   🔄 Przetworzono: ${processed}/${allResources.length} plików...`);
        }
      } catch (err) {
        console.error(`\n   ❌ Błąd pliku ${public_id}:`, err.message);
      }
    }

    // Dodaj metadane do ZIP
    archive.append(JSON.stringify(metadata, null, 2), { name: 'metadata.json' });

    console.log('\n   🏁 Kończenie archiwizacji...');
    await archive.finalize();

    // Czekaj na domknięcie pliku
    await new Promise(resolve => output.on('close', resolve));

    // Upload na Google Drive
    const fileNameOnDrive = path.basename(zipPath);
    const result = await uploadFileToDrive(zipPath, fileNameOnDrive, accessToken);
    
    console.log("\n🎉 KOPIA ZAPASOWA CLOUDINARY PRZESŁANA POMYŚLNIE!");
    console.log(`🆔 ID pliku w chmurze: ${result.id}`);
    console.log(`📢 Archiwum zawiera ${processed} plików oraz plik metadata.json.`);

  } catch (error) {
    console.error("\n❌ BŁĄD:", error.message || error);
  } finally {
    await client.close();
    // Usuń lokalny plik ZIP po wysłaniu
    if (fs.existsSync(zipPath)) {
      fs.unlinkSync(zipPath);
      console.log("🧹 Usunięto lokalny plik tymczasowy ZIP.");
    }
    console.log("🔌 Połączenie zamknięte.");
  }
}

backupCloudinaryToDrive();
