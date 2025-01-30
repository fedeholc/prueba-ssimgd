//import ItemForm from "./ItemForm";
import NewItemForm2 from "./NewItemForm2";

export default async function newItem() {
  return (
    <>
      <h3>item/id/new</h3>

      <NewItemForm2
        sourceItem={{
          _id: "",
          name: "New Source",
          url: "http://",
          pages: [],
        }}
      />

      {/*  <PagesDisplay pages={source.pages} /> */}
    </>
  );
}
