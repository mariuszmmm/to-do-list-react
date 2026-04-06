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

const oldUri = process.env.MONGODB_URI; 
const newUri = process.env.NEW_MONGODB_URI; 
const dbName = process.env.MONGODB_DATABASE;

// Funkcja pomocnicza do zadawania pytań w terminalu
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

if (!dbName) {
  console.error("❌ BŁĄD: Brakuje zmiennej MONGODB_DATABASE w Twoim pliku .env!");
  process.exit(1);
}

if (!oldUri) {
  console.error("❌ BŁĄD: Brakuje zmiennej MONGODB_URI w pliku .env!");
  process.exit(1);
}

if (!newUri) {
  console.log("=========================================================================");
  console.log("🛠️ INTERAKTYWNE NARZĘDZIE DO MIGRACJI BAZ MONGODB (Safety Mode) 🛠️");
  console.log("=========================================================================");
  console.log("✅ Wczytuję adres starej bazy z MONGODB_URI.");
  console.log("\n⚠️ ABY ROZPOCZĄĆ, DOPISZ DO .env NOWĄ ZMIENNĄ:");
  console.log("   NEW_MONGODB_URI=mongodb+srv://user:haslo@cluster0...");
  console.log("\n📖 Pełna instrukcja znajduje się w pliku: scripts/MongoDB/README-MONGODB-TOOLS.md");
  console.log("=========================================================================\n");
  process.exit(0);
}

function checkGitIgnore() {
  const gitIgnorePath = path.join(__dirname, "../../.gitignore");
  const backupEntry = "scripts/MongoDB/backups/";

  if (!fs.existsSync(gitIgnorePath)) {
    console.log("⚠️ UWAGA: Brak pliku .gitignore w katalogu głównym projektu.");
    return false;
  }

  const content = fs.readFileSync(gitIgnorePath, "utf8");
  if (!content.includes(backupEntry)) {
    console.log(`\n🛡️  ZABEZPIECZANIE: Automatycznie dodaję '${backupEntry}' do Twojego pliku .gitignore...`);
    try {
      // Dodajemy nową linię na końcu pliku .gitignore
      const separator = content.endsWith("\n") ? "" : "\n";
      fs.appendFileSync(gitIgnorePath, `${separator}\n# mongodb backups\n${backupEntry}\n`);
      console.log("✅ Plik .gitignore został pomyślnie zaktualizowany. Twoje dane są bezpieczne.");
    } catch (err) {
      console.error("❌ Nie udało się automatycznie zaktualizować pliku .gitignore:", err.message);
      return false;
    }
  }
  return true;
}

async function backupTargetDb(client, dbName) {
  // Sprawdzamy czy backupy są w gitignore zanim cokolwiek zapiszemy na dysku!
  if (!checkGitIgnore()) {
    process.exit(1);
  }

  const db = client.db(dbName);
  const collections = await db.listCollections().toArray();
  const backupFolder = path.join(__dirname, "backups");
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const currentBackupPath = path.join(backupFolder, `backup-MIGRATION-${timestamp}`);

  if (!fs.existsSync(backupFolder)) fs.mkdirSync(backupFolder);
  fs.mkdirSync(currentBackupPath);

  console.log(`💾 Tworzę kopię bezpieczeństwa NOWEJ bazy w: ${currentBackupPath}`);

  for (let colInfo of collections) {
    const colName = colInfo.name;
    const docs = await db.collection(colName).find({}).toArray();
    if (docs.length > 0) {
      fs.writeFileSync(
        path.join(currentBackupPath, `${colName}.json`),
        JSON.stringify(docs, null, 2),
      );
      console.log(`   📦 Zapisano ${docs.length} dokumentów z [${colName}]`);
    }
  }
}

async function migrate() {
  console.log("🚀 Rozpoczynam proces migracji...");
  const oldClient = new MongoClient(oldUri);
  const newClient = new MongoClient(newUri);

  try {
    await oldClient.connect();
    await newClient.connect();
    
    const oldDb = oldClient.db(dbName);
    const newDb = newClient.db(dbName);

    // SPRAWDZENIE: Czy nowa baza ma już dane w jakiejkolwiek kolekcji?
    const newCollections = await newDb.listCollections().toArray();
    let hasData = false;
    for (let col of newCollections) {
      const count = await newDb.collection(col.name).countDocuments();
      if (count > 0) {
        hasData = true;
        break;
      }
    }

    if (hasData) {
      console.log("\n⚠️ UWAGA: Wykryto istniejące dane w bazie DOCELOWEJ!");
      console.log("🚨 Kontynuowanie migracji SPOWODUJE NADPISANIE tych danych danymi ze starej bazy.");
      
      // WYMUSZONY BACKUP DO PLIKU
      await backupTargetDb(newClient, dbName);
      console.log("✅ Kopia zapasowa bazy docelowej została pomyślnie wykonana na dysku.");

      const answer = await askQuestion("\n❓ Kopia została zapisana. Czy na pewno chcesz NADPISAĆ dane w nowej bazie? (t/n): ");
      if (answer !== "t" && answer !== "tak" && answer !== "y" && answer !== "yes") {
        console.log("🛑 Migracja przerwana. Twoje dane w nowej bazie są bezpieczne i mają kopię na dysku.");
        return;
      }
    }

    const collections = await oldDb.listCollections().toArray();
    for (let colInfo of collections) {
      const colName = colInfo.name;
      const docs = await oldDb.collection(colName).find({}).toArray();

      if (docs.length > 0) {
        console.log(`📦 Przenoszę kolekcję: [${colName}] (${docs.length} dok.)`);
        await newDb.collection(colName).deleteMany({}); 
        const result = await newDb.collection(colName).insertMany(docs);
        console.log(`   ✅ Wgrano pomyślnie (${result.insertedCount} dok.).`);
      }
    }

    console.log("\n🎉 MIGRACJA ZAKOŃCZONA SUKCESEM!");
  } catch (error) {
    console.error("❌ Wystąpił błąd:", error);
  } finally {
    await oldClient.close();
    await newClient.close();
    console.log("🔌 Połączenia zamknięte.");
  }
}

migrate();
