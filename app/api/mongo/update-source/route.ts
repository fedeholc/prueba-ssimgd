import { getDatabase } from "../../../lib/mongodb";
import { ObjectId } from "mongodb";


export async function POST(req: Request) {
  const { source } = await req.json();
  const database = await getDatabase();
  const coll = database.collection("series");
  const result = await coll.updateOne({ _id: ObjectId.createFromHexString(source._id) }, { $set: { name: source.name, url: source.url, pages: source.pages } });
  return Response.json(result, { status: 200 });
}