'use server'
import { getDatabase } from "../../../lib/mongodb";
import { ObjectId } from "mongodb";
//import { redirect } from "next/navigation";
import { revalidatePath } from 'next/cache'


export async function deleteItemAction(sourceId: string) {

  const database = await getDatabase();
  const coll = database.collection("series");


  const result = await coll.deleteOne({ _id: ObjectId.createFromHexString(sourceId) });

  revalidatePath("/dash-server/item/");

  return result;
}