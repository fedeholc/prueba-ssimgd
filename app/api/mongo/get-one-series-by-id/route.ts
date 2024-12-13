
import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI || "ERROR: No URI provided";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


export async function POST(req: Request) {

  const { id } = await req.json();

  await client.connect();
  // Send a ping to confirm a successful connection
  const database = client.db("ssaver");
  const coll = database.collection("series");
  const result = await coll.findOne({ _id: ObjectId.createFromHexString(id) });

  console.log("result get one:", result);
  //await client.close(); //VER ojo, si se cierra la conexión y la tiene que volver a abrir en cada request, se hace más lenta la respuesta y da errores cuando se seleccionan varias opciones del select muy rapido en el dash
  return Response.json(result, { status: 200 });

}