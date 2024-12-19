'use server'
import { getDatabase } from "../../../lib/mongodb";
import { ObjectId } from "mongodb";
import { revalidatePath } from 'next/cache'


export async function saveFormAction(source: Source) {

  const database = await getDatabase();
  const coll = database.collection("series");
  const result = await coll.updateOne({ _id: ObjectId.createFromHexString(source._id) }, { $set: { name: source.name, url: source.url, pages: source.pages } });

  //await new Promise(resolve => setTimeout(resolve, 3000));
  
  revalidatePath('/dash-server/item/' + source._id);

  return result; 

}