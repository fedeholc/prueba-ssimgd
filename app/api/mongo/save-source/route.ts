import { getDatabase } from "../../../lib/mongodb";

export async function POST(req: Request) {
  const { source } = await req.json();
  const database = await getDatabase();
  const coll = database.collection("series");
  const result = await coll.insertOne(source);
  return Response.json({ insertedId: result.insertedId }, { status: 200 });
}