const API_URL =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:5001";

export async function getData() {
  const response = await fetch(API_URL + "/log.json");
  if (response.status !== 200) {
    throw new Error(`Error fetching data: ${response.status}`);
  }
  return response.json();
}

export async function getLayerData() {
  const response = await fetch(API_URL + "/layers.json");
  if (response.status !== 200) {
    throw new Error(`Error fetching data: ${response.status}`);
  }

  return response.json();
}
