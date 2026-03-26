const cloudinary = require('cloudinary').v2;
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
const dns = require("dns");
const axios = require("axios");
const path = require("path");
const fs = require("fs");
const readline = require("readline");
const extract = require("extract-zip");

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

/**
 * Replikacja logiki pobierania tokenu z bazy danych.
 */
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

  if (!activeRefreshToken) throw new Error("Brak Refresh Tokena. Musisz najpierw autoryzować Google w aplikacji.");

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

/**
 * Listuje pliki w folderze Cloudinary-Backups.
 */
async function listCloudinaryBackups(accessToken) {
  // 1. Znajdź główny folder
  const rootSearch = await axios.get(`https://www.googleapis.com/drive/v3/files?q=name='To-do-list_Backups' and trashed=false&fields=files(id)`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  if (!rootSearch.data.files.length) return [];
  
  const rootId = rootSearch.data.files[0].id;

  // 2. Znajdź podfolder Cloudinary-Backups
  const subSearch = await axios.get(`https://www.googleapis.com/drive/v3/files?q=name='Cloudinary-Backups' and '${rootId}' in parents and trashed=false&fields=files(id)`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  
  if (!subSearch.data.files.length) return [];
  const folderId = subSearch.data.files[0].id;

  // 3. Listuj pliki ZIP
  const fileSearch = await axios.get(`https://www.googleapis.com/drive/v3/files?q='${folderId}' in parents and trashed=false and mimeType='application/zip'&fields=files(id,name,createdTime)&orderBy=createdTime desc`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  
  return fileSearch.data.files || [];
}

async function downloadFile(fileId, accessToken, targetPath) {
  const response = await axios({
    method: 'get',
    url: `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
    headers: { Authorization: `Bearer ${accessToken}` },
    responseType: 'stream'
  });

  const writer = fs.createWriteStream(targetPath);
  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

async function restoreCloudinaryFromDrive() {
  console.log("=========================================================================");
  console.log("🛠️  PRZYWRACANIE CLOUDINARY Z DYSKU GOOGLE ☁️ -> 💾");
  console.log("=========================================================================");

  if (!uri || !dbName || !process.env.CLOUDINARY_CLOUD_NAME) {
    console.error("❌ BŁĄD: Brakuje wymaganych zmiennych w pliku .env!");
    return;
  }

  const client = new MongoClient(uri);
  const tempZip = path.join(__dirname, `temp_restore_${Date.now()}.zip`);
  const extractDir = path.join(__dirname, `temp_extract_${Date.now()}`);

  try {
    await client.connect();
    const accessToken = await getAccessToken(client);

    console.log("🔍 Szukam kopii zapasowych Cloudinary na Dysku Google...");
    const backups = await listCloudinaryBackups(accessToken);

    if (backups.length === 0) {
      console.log("❌ Nie znaleziono żadnych kopii Cloudinary w folderze Cloudinary-Backups.");
      return;
    }

    console.log("\nDostępne kopie zapasowe (od najnowszej):");
    backups.forEach((b, i) => {
      console.log(`[${i + 1}] ${b.name} (${new Date(b.createdTime).toLocaleString()})`);
    });

    const choiceIdx = await askQuestion("\n👉 Wybierz numer kopii do przywrócenia (lub 'n' aby anulować): ");
    if (choiceIdx === 'n') return;
    
    const selectedFile = backups[parseInt(choiceIdx) - 1];
    if (!selectedFile) {
      console.log("🛑 Nieprawidłowy wybór.");
      return;
    }

    console.log(`\n⏳ Pobieram archiwum: ${selectedFile.name}...`);
    await downloadFile(selectedFile.id, accessToken, tempZip);
    console.log("✅ Pomyślnie pobrano archiwum.");

    console.log("📦 Rozpakowuję pliki...");
    await extract(tempZip, { dir: extractDir });
    console.log("✅ Archiwum rozpakowane.");

    const metadataPath = path.join(extractDir, 'metadata.json');
    if (!fs.existsSync(metadataPath)) {
      throw new Error("Pobrany backup nie zawiera pliku metadata.json.");
    }

    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
    console.log(`\nFound ${metadata.length} resources in backup.`);
    
    const confirm = await askQuestion(`❓ Czy na pewno przywrócić te pliki? Może to nadpisać istniejące zasoby na Cloudinary. (t/n): `);
    if (confirm !== 't' && confirm !== 'tak' && confirm !== 'y') {
      console.log("🛑 Anulowano.");
      return;
    }

    let successCount = 0;
    let failCount = 0;

    for (const entry of metadata) {
      const localFilePath = path.join(extractDir, entry.zip_path);
      
      if (!fs.existsSync(localFilePath)) {
        console.warn(`\n   ⚠️  Pominięto (brak pliku): ${entry.zip_path}`);
        failCount++;
        continue;
      }

      process.stdout.write(`\r   🚀 Przesyłam [${entry.resource_type}] ${entry.public_id}... `);

      try {
        const options = {
          public_id: entry.public_id,
          resource_type: entry.resource_type,
          asset_folder: entry.asset_folder || '',
          display_name: entry.display_name || '',
          use_asset_folder_as_public_id_prefix: false,
          overwrite: true,
          invalidate: true
        };

        await cloudinary.uploader.upload(localFilePath, options);
        successCount++;
      } catch (err) {
        console.error(`\n   ❌ Błąd przesyłania ${entry.public_id}:`, err.message);
        failCount++;
      }
    }

    console.log('\n\n--- Podsumowanie Przywracania ---');
    console.log(`Sukces: ${successCount}`);
    console.log(`Błędy: ${failCount}`);
    console.log(`Łącznie: ${metadata.length}`);
    console.log(`\n🎉 PRZYWRACANIE Z DYSKU GOOGLE ZAKOŃCZONE!`);

  } catch (error) {
    console.error("\n❌ BŁĄD:", error.message || error);
  } finally {
    await client.close();
    
    // Cleanup
    if (fs.existsSync(tempZip)) fs.unlinkSync(tempZip);
    if (fs.existsSync(extractDir)) {
      fs.rmSync(extractDir, { recursive: true, force: true });
    }
    console.log("🧹 Usunieto tymczasowe pliki lokalne.");
    console.log("🔌 Połączenie zamknięte.");
  }
}

restoreCloudinaryFromDrive();
