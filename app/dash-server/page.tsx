 
 export default async function Dash() {
 
  const response = await fetch(
    "http://localhost:3000/api/mongo/get-sources-list"
  );
  console.log(response);
  if (!response.ok) {
    return;
  }
  
  return (
    <div>
      <h1>Dashboard page</h1>
      {/*       <button onClick={handleNewSource}>New source</button>
       */}
    </div>
  );
}
