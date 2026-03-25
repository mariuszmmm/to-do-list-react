const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
const dns = require("dns");
const fs = require("fs");
const path = require("path");
const readline = require("readline");

// Wymuszenie publicznego DNS do sprawnego działania SRV na Twoim PC
dns.setServers(['1.1.1.1', '8.8.8.8']);

// Wczytujemy WYŁĄCZNIE i BEZPOŚREDNIO dane z głównego pliku .env
dotenv.config();

const uri = process.env.MONGODB_URI; 
const dbName = process.env.MONGODB_DATABASE;

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

function checkGitIgnore() {
  const gitIgnorePath = path.join(__dirname, "../../.gitignore");
  const backupEntry = "scripts/MongoDB/backups/";

  if (!fs.existsSync(gitIgnorePath)) return true; // Jeśli nie ma gita, to nie blokujemy

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

async function createBackup(client, dbName) {
  checkGitIgnore();
  const db = client.db(dbName);
  const collections = await db.listCollections().toArray();
  const backupFolder = path.join(__dirname, "backups");
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const currentBackupPath = path.join(backupFolder, `backup-BEFORE-RESTORE-${timestamp}`);

  if (!fs.existsSync(backupFolder)) fs.mkdirSync(backupFolder);
  fs.mkdirSync(currentBackupPath);

  console.log(`💾 Tworzę kopię bezpieczeństwa OBECNEJ bazy w: ${currentBackupPath}`);

  for (let colInfo of collections) {
    const colName = colInfo.name;
    const docs = await db.collection(colName).find({}).toArray();
    if (docs.length > 0) {
      fs.writeFileSync(path.join(currentBackupPath, `${colName}.json`), JSON.stringify(docs, null, 2));
      console.log(`   📦 Zapisano ${docs.length} dokumentów z [${colName}]`);
    }
  }
}

if (!uri || !dbName) {
  console.error("❌ BŁĄD: Brakuje zmiennych MONGODB_URI lub MONGODB_DATABASE w Twoim pliku .env!");
  process.exit(1);
}

async function restore() {
  console.log("=========================================================================");
  console.log("🛠️  NARZĘDZIE DO PRZYWRACANIA KOPII ZAPASOWEJ MONGODB (Restore Mode) 🛠️");
  console.log("=========================================================================");
  console.log("📖 Instrukcja narzędzi: scripts/MongoDB/README-MONGODB-TOOLS.md");

  const backupRoot = path.join(__dirname, "backups");
  if (!fs.existsSync(backupRoot)) {
    console.error("❌ BŁĄD: Nie znaleziono folderu z kopiami zapasowymi (backups/).");
    return;
  }

  const backups = fs.readdirSync(backupRoot).filter(f => fs.statSync(path.join(backupRoot, f)).isDirectory());
  if (backups.length === 0) {
    console.error("❌ BŁĄD: Folder 'backups/' jest pusty.");
    return;
  }

  console.log("\nDostępne kopie zapasowe:");
  backups.forEach((b, index) => {
    // Wyciągamy datę z nazwy folderu i ładnie formatujemy
    // Czyścimy wszystkie prefiksy, aby została sama data
    let displayDate = b
      .replace("backup-", "")
      .replace("BEFORE-RESTORE-", "")
      .replace("MIGRATION-", "")
      .replace("MANUAL-", "");
    
    try {
      const isoString = displayDate.replace(/(\d{2})-(\d{2})-(\d{2})-(\d{3})Z$/, "$1:$2:$3.$4Z");
      const date = new Date(isoString);
      displayDate = date.toLocaleString("pl-PL", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" });
    } catch (e) {}
    console.log(`[${index + 1}] ${displayDate} (${b})`);
  });

  const choiceIdx = await askQuestion("\n👉 Wybierz numer kopii do przywrócenia (lub 'n' aby anulować): ");
  const selectedBackup = backups[parseInt(choiceIdx) - 1];

  if (!selectedBackup) {
    console.log("🛑 Anulowano.");
    return;
  }

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);

    // SPRAWDZENIE: Czy w bazie docelowej są dane?
    const currentCollections = await db.listCollections().toArray();
    let hasData = false;
    for (let col of currentCollections) {
      if (await db.collection(col.name).countDocuments() > 0) {
        hasData = true;
        break;
      }
    }

    if (hasData) {
      console.log("\n⚠️ UWAGA: Wykryto istniejące dane w Twojej obecnej bazie danych!");
      const doBackup = await askQuestion("❓ Czy chcesz wykonać kopię zapasową obecnego stanu przed nadpisaniem? (t/n): ");
      
      if (doBackup === "t" || doBackup === "tak") {
        await createBackup(client, dbName);
        console.log("✅ Kopia zapasowa 'PRZED PRZYWRÓCENIEM' została wykonana.");
      } else {
        console.log("⏭️ Pominięto tworzenie kopii zapasowej.");
      }
    }

    console.log(`\n⚠️ OSTRZEŻENIE: Przywrócenie kopii [${selectedBackup}] nadpisze dane w bazie: ${dbName}!`);
    const confirm = await askQuestion(`❓ Czy na pewno kontynuować? (t/n): `);

    if (confirm !== "t" && confirm !== "tak" && confirm !== "y" && confirm !== "yes") {
      console.log("🛑 Operacja anulowana.");
      return;
    }

    const backupPath = path.join(backupRoot, selectedBackup);
    const files = fs.readdirSync(backupPath).filter(f => f.endsWith(".json"));

    console.log("\n🚀 Rozpoczynam przywracanie...");
    for (let file of files) {
      const colName = file.replace(".json", "");
      const docs = JSON.parse(fs.readFileSync(path.join(backupPath, file), "utf8"));
      if (docs.length > 0) {
        console.log(`📦 Przywracam: [${colName}] (${docs.length} dok.)`);
        await db.collection(colName).deleteMany({});
        await db.collection(colName).insertMany(docs);
      }
    }
    console.log("\n🎉 PRZYWRACANIE ZAKOŃCZONE SUKCESEM!");
  } catch (error) {
    console.error("❌ BŁĄD:", error);
  } finally {
    await client.close();
    console.log("🔌 Połączenie zamknięte.");
  }
}

restore();
