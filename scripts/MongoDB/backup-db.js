const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
const dns = require("dns");
const fs = require("fs");
const path = require("path");

// Wymuszenie publicznego DNS do sprawnego działania SRV na Twoim PC
dns.setServers(['1.1.1.1', '8.8.8.8']);

// Wczytujemy WYŁĄCZNIE i BEZPOŚREDNIO dane z głównego pliku .env
dotenv.config();

const uri = process.env.MONGODB_URI; 
const dbName = process.env.MONGODB_DATABASE;

function checkGitIgnore() {
  const gitIgnorePath = path.join(__dirname, "../../.gitignore");
  const backupEntry = "scripts/MongoDB/backups/";

  if (!fs.existsSync(gitIgnorePath)) return true;

  const content = fs.readFileSync(gitIgnorePath, "utf8");
  if (!content.includes(backupEntry)) {
    console.log(`\n🛡️  ZABEZPIECZANIE: Automatycznie dodaję '${backupEntry}' do Twojego pliku .gitignore...`);
    try {
      const separator = content.endsWith("\n") ? "" : "\n";
      fs.appendFileSync(gitIgnorePath, `${separator}\n# mongodb backups\n${backupEntry}\n`);
      console.log("✅ Plik .gitignore został pomyślnie zaktualizowany.");
    } catch (err) {
      console.error("❌ Błąd .gitignore:", err.message);
    }
  }
  return true;
}

if (!uri || !dbName) {
  console.error("❌ BŁĄD: Brakuje zmiennych MONGODB_URI lub MONGODB_DATABASE w Twoim pliku .env!");
  process.exit(1);
}

async function backup() {
  console.log("=========================================================================");
  console.log("💾  NARZĘDZIE DO TWORZENIA KOPII ZAPASOWEJ MONGODB (Manual Backup) 🛠️");
  console.log("=========================================================================");
  console.log("📖 Instrukcja narzędzi: scripts/MongoDB/README-MONGODB-TOOLS.md\n");

  checkGitIgnore();
  
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const collections = await db.listCollections().toArray();
    
    if (collections.length === 0) {
      console.log("⚠️ Baza jest pusta. Nie ma czego kopia zapasowa.");
      return;
    }

    const backupFolder = path.join(__dirname, "backups");
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const timestamp = `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
    const currentBackupPath = path.join(backupFolder, `backup-MANUAL-${timestamp}`);

    if (!fs.existsSync(backupFolder)) fs.mkdirSync(backupFolder);
    fs.mkdirSync(currentBackupPath);

    console.log(`🚀 Rozpoczynam tworzenie kopii bazy [${dbName}]...`);
    console.log(`📁 Folder docelowy: ${currentBackupPath}\n`);

    for (let colInfo of collections) {
      const colName = colInfo.name;
      const docs = await db.collection(colName).find({}).toArray();
      if (docs.length > 0) {
        fs.writeFileSync(path.join(currentBackupPath, `${colName}.json`), JSON.stringify(docs, null, 2));
        console.log(`   📦 [${colName}]: Zapisano ${docs.length} dokumentów.`);
      } else {
        console.log(`   ⏭️ [${colName}]: Kolekcja jest pusta. Pomijam.`);
      }
    }

    console.log("\n🎉 KOPIA ZAPASOWA WYKONANA POMYŚLNIE!");
  } catch (error) {
    console.error("❌ BŁĄD podczas tworzenia kopii:", error);
  } finally {
    await client.close();
    console.log("🔌 Połączenie zamknięte.");
  }
}

backup();
