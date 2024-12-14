
import { getDatabase } from "../../../lib/mongodb";

export async function GET() {
  const database = await getDatabase();
  const coll = database.collection("series");
  const cursor = coll.find();
  const rta = await cursor.toArray();
  return Response.json(rta);
}