
import { MongoClient, ServerApiVersion } from "mongodb";
import { NextRequest } from "next/server";

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

  const { name } = await req.json();

  await client.connect();
  // Send a ping to confirm a successful connection
  const database = client.db("ssaver");
  const coll = database.collection("series");
  const doc = { name: name, shape: "round" };
  const result = await coll.insertOne(doc);
  console.log(
    `A document was inserted with the _id: ${result.insertedId}`,
  );

  await client.close();
  return Response.json("a",{status:200});

}