
import { MongoClient, ServerApiVersion } from "mongodb";

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

  const { source } = await req.json();

  await client.connect();
  // Send a ping to confirm a successful connection
  const database = client.db("ssaver");
  const coll = database.collection("series");
  const doc = source;
  console.log("Updating document", doc);

  //TODO: por qué no lo encuentra para el update??
  const find = await coll.findOne({ _id: doc._id });
  console.log("Found document", find);
  const result = await coll.updateOne({ _id: doc._id }, { $set: doc });
  console.log("Updated document", result);
  await client.close();
  return Response.json(result, { status: 200 });

}