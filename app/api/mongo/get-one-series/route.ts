import { getDatabase } from "../../../lib/mongodb";


export async function POST(req: Request) {
  const { name } = await req.json();
  const database = await getDatabase();
  const coll = database.collection("series");
  const result = await coll.findOne({ name: name });
  return Response.json(result, { status: 200 });
}