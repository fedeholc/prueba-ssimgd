'use server'
import { getDatabase } from "../../../lib/mongodb";

import { redirect } from "next/navigation";


export async function saveNewFormAction2(prevState: unknown, form: FormData) {


  let resultAcknowledged;
  let insertedId;

  try {
    const source = {
      url: form.get("url") as string,
      name: form.get("name") as string,
    };

    const database = await getDatabase();
    const coll = database.collection("series");
    const result = await coll.insertOne(source);

    console.log("Result: ", result);

    resultAcknowledged = result.acknowledged;
    insertedId = result.insertedId;

  } catch (error) {
    console.log("Error: ", error);
    return "error";
  }

  if (resultAcknowledged && insertedId) {
    redirect('/dash-server/item/' + insertedId);
  }
  else {
    return "error";
  }


}