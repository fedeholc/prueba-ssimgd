import { ObjectId } from "mongodb";
import { getDatabase } from "../../../lib/mongodb";


export async function POST(req: Request) {
  const { id } = await req.json();
  const database = await getDatabase();
  const coll = database.collection("series");
  const result = await coll.findOne({ _id: ObjectId.createFromHexString(id) });
  return Response.json(result, { status: 200 });
}