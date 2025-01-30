'use server'
import { getDatabase } from "../../../lib/mongodb";
import { ObjectId } from "mongodb";
import { revalidatePath } from 'next/cache'


export async function saveFormAction2(prevState: unknown, form: FormData) {

  console.log("saveFormAction", form);

  const source = {
    _id: form.get("id") as string,
    name: form.get("name") as string,
  };

  if (!source._id) {
    return "error";
  }

  const database = await getDatabase();
  const coll = database.collection("series");
  const result = await coll.updateOne({ _id: ObjectId.createFromHexString(source._id) }, { $set: { name: source.name, } });

  //await new Promise(resolve => setTimeout(resolve, 3000));

  revalidatePath('/dash-server/item/' + source._id);

  console.log("Result: ", result);
  return result.acknowledged ? "ok" : "error";

}