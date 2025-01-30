import SourcePages from "../../SourcePages";
import { ObjectId } from "mongodb";
import { getDatabase } from "../../../lib/mongodb";
import ItemForm from "./ItemForm";
import ItemForm2 from "./ItemForm2";
import DeleteItemButton from "../new/DeleteItemButton";

export default async function Source({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const database = await getDatabase();
  const coll = database.collection("series");

  //check if id is valid
  if (!ObjectId.isValid(id)) {
    return <div>Invalid source id</div>;
  }
  const res = await coll.findOne({ _id: ObjectId.createFromHexString(id) });

  if (!res) {
    return <div>Source not found</div>;
  }

  const source: Source = JSON.parse(JSON.stringify(res)) as Source;

  return (
    <>
      <h3>item/id/page</h3>
      <DeleteItemButton sourceId={source._id} />
      <div>Name: {source.name}</div>
      <div>URL: {source.url}</div>

      <div>Source Id: {source._id}</div>

      <ItemForm sourceItem={source} />
      <p>otro:</p>
      <ItemForm2 sourceItem={source} />

      <SourcePages pages={source.pages} />
    </>
  );
}
