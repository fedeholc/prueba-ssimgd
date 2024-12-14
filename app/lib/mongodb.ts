// lib/mongodb.ts
 import { MongoClient,Db, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_URI || "ERROR: No URI provided";

declare global {
  // Permite agregar _mongoClientPromise al tipo global de Node.js
  // para evitar errores en TypeScript
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient>;
}

let client: MongoClient | undefined;
//const clientPromise: Promise<MongoClient>;
let db: Db | undefined;

// Reutiliza la conexión en el entorno global de Node.js
if (!global._mongoClientPromise) {
  client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
  global._mongoClientPromise = client.connect(); // Conexión inicial
}

const clientPromise = global._mongoClientPromise;

export async function getDatabase(): Promise<Db> {
  if (!db) {
    const client = await clientPromise;
    db = client.db(process.env.MONGODB_DB || 'ssaver'); // Nombre de la base de datos
  }
  return db;
}


