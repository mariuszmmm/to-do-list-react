const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const readline = require('readline');

// Load environment variables from the root .env file
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

const BACKUP_ROOT = path.join(__dirname, 'backups');

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

async function getAllLocalBackups() {
  if (!fs.existsSync(BACKUP_ROOT)) return [];
  
  const dirs = fs.readdirSync(BACKUP_ROOT).filter(f => 
    fs.statSync(path.join(BACKUP_ROOT, f)).isDirectory() && f.startsWith('cloudinary_backup_')
  );
  
  // Sort by date (filename has ISO date string, typically latest first if we reverse after sort)
  return dirs.sort().reverse();
}

async function restoreCloudinary() {
  console.log("=========================================================================");
  console.log('🛠️  PRZYWRACANIE LOKALNEGO CLOUDINARY -> 💾');
  console.log("=========================================================================");

  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error('❌ BŁĄD: Brakuje danych logowania do Cloudinary w pliku .env!');
    return;
  }

  // Get backup folder from command line argument
  let backupFolderName = process.argv[2];
  
  if (!backupFolderName) {
    const backups = await getAllLocalBackups();
    if (backups.length === 0) {
      console.error('❌ BŁĄD: Nie znaleziono żadnych kopii w scripts/Cloudinary/backups/');
      return;
    }

    console.log("\nDostępne lokalne kopie zapasowe (od najnowszej):");
    backups.forEach((b, i) => {
      console.log(`[${i + 1}] ${b}`);
    });

    const choiceIdx = await askQuestion("\n👉 Wybierz numer kopii do przywrócenia (lub 'n' aby anulować): ");
    if (choiceIdx === 'n') return;
    
    backupFolderName = backups[parseInt(choiceIdx) - 1];
  }

  if (!backupFolderName) {
    console.log("🛑 Nieprawidłowy wybór lub brak kopii.");
    return;
  }

  const backupDir = path.join(BACKUP_ROOT, backupFolderName);
  const metadataPath = path.join(backupDir, 'metadata.json');

  if (!fs.existsSync(metadataPath)) {
    console.error(`❌ BŁĄD: Nie znaleziono pliku metadata.json w ${backupDir}`);
    return;
  }

  console.log(`\n⏳ Przywracam z: ${backupFolderName}...`);
  const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));

  const confirm = await askQuestion(`❓ Czy na pewno przywrócić te pliki (${metadata.length} zasobów)? (t/n): `);
  if (confirm !== 't' && confirm !== 'tak' && confirm !== 'y') {
    console.log("🛑 Operacja anulowana.");
    return;
  }

  let successCount = 0;
  let failCount = 0;

  for (const entry of metadata) {
    // In local backup entry.local_path is used. In Google Drive backup entry.zip_path was used.
    // Making it compatible with both structures if it happened to be one or the other.
    const relativePath = entry.local_path || entry.zip_path;
    const localFilePath = path.join(backupDir, relativePath);
    
    if (!fs.existsSync(localFilePath)) {
      console.warn(`\n   ⚠️  Pominięto (brak pliku): ${relativePath}`);
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
  console.log(`\n🎉 LOKALNE PRZYWRACANIE ZAKOŃCZONE!`);
}

restoreCloudinary();
