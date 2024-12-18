import PagesDisplay from "../../PagesDisplay";

export default async function SourceItem({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  const response = await fetch(
    "http://localhost:3000/api/mongo/get-one-series-by-id",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    }
  );

  if (!response.ok) {
    throw new Error("Error al obtener los datos");
  }
  const source = await response.json();

  //TODO: acá irían el form de edición pero hay que ver cómo hacerlo con server actions, o con un componente client
  return (
    <>
      <div>Name: {source.name}</div>
      <div>URL: {source.url}</div>

      <div>Source Id: {source._id}</div>
      <PagesDisplay pages={source.pages} />
    </>
  );
}
