
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

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("ssaver").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

export async function GET() {
  await client.connect();
  // Send a ping to confirm a successful connection
  const database = client.db("ssaver");
  console.log("Database:", database);
  const coll = database.collection("series");
  const cursor = coll.find();


  const a = await cursor.toArray();
  /*  // Print returned documents
   for await (const doc of cursor) {
     console.dir(doc);
   } */
  console.log("cursor array:", await cursor.toArray());
  await client.close();
  return Response.json(a);

}