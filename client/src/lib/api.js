export async function getData() {
  const response = await fetch("http://localhost:5000/log.json");
  if (response.status !== 200) {
    throw new Error(`Error fetching data: ${response.status}`);
  }
  return response.json();
}
