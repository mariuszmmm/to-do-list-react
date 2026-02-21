import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(process.cwd(), ".env") });

async function dropIndex() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("Brak MONGODB_URI w pliku .env");
    return;
  }

  try {
    console.log("Łączenie z MongoDB...");
    await mongoose.connect(uri);
    const db = mongoose.connection.db;

    if (!db) {
      console.error("Nie udało się uzyskać dostępu do obiektu bazy danych.");
      return;
    }

    // Nazwa kolekcji to 'users'
    const collection = db.collection("users");

    console.log("Sprawdzanie istniejących indeksów...");
    const indexes = await collection.indexes();
    console.log(
      "Znalezione indeksy:",
      indexes.map((i) => i.name),
    );

    const indexName = "lists.id_1";
    if (indexes.find((i) => i.name === indexName)) {
      console.log(`Usuwanie indeksu ${indexName}...`);
      await collection.dropIndex(indexName);
      console.log("Indeks usunięty pomyślnie!");
    } else {
      console.log(`Indeks ${indexName} nie istnieje lub został już usunięty.`);
    }
  } catch (err) {
    console.error("Błąd podczas operacji:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Rozłączono.");
  }
}

dropIndex();
