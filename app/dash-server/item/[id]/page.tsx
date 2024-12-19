import PagesDisplay from "../../PagesDisplay";
import { ObjectId } from "mongodb";
import { getDatabase } from "../../../lib/mongodb";
import ItemForm from "./ItemForm";
import ItemForm2 from "./ItemForm2";

export default async function SourceItem({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  const database = await getDatabase();
  const coll = database.collection("series");
  const res = await coll.findOne({ _id: ObjectId.createFromHexString(id) });

  if (!res) {
    throw new Error("No se encontró la serie");
  }

  const source: Source = JSON.parse(JSON.stringify(res)) as unknown as Source;

  return (
    <>
      <div>Name: {source.name}</div>
      <div>URL: {source.url}</div>

      <div>Source Id: {source._id}</div>

      <ItemForm sourceItem={source} />
      <p>otro:</p>
      <ItemForm2 sourceItem={source} />

      <PagesDisplay pages={source.pages} />
    </>
  );
}
