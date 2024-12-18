"use server";
export default async function SourcePrueba({
  selectedItem,
}: {
  selectedItem: string;
}) {
  const response = await fetch(
    "http://localhost:3000/api/mongo/get-one-series-by-id",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: selectedItem }),
    }
  );

  if (!response.ok) {
    throw new Error("Error al obtener los datos");
  }
  const responseData = await response.json();

  console.log(responseData);
  return <div>{selectedItem}</div>;
}
