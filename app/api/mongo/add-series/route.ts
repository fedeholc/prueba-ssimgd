
import { getDatabase } from "../../../lib/mongodb";

export async function POST(req: Request) {
  const { name } = await req.json();
  const database = await getDatabase();
  const coll = database.collection("series");
  const doc = { name: name, shape: "round" };
  const result = await coll.insertOne(doc);
  return Response.json(result, { status: 200 });
}