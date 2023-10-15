const API_URL =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:12000";

export async function listKeyboards() {
  const response = await fetch(API_URL + "/api/keyboards");
  if (response.status !== 200) {
    throw new Error(`Error fetching data: ${response.status}`);
  }

  const responseJson = await response.json();
  return responseJson.keyboards;
}

export async function getDates(keyboardId) {
  const response = await fetch(
    API_URL + "/api/keyboards/" + keyboardId + "/available-dates",
  );
  if (response.status !== 200) {
    throw new Error(`Error fetching data: ${response.status}`);
  }

  const responseJson = await response.json();
  return responseJson.dates;
}

export async function getKeyboardKeymaps(keyboardId) {
  const response = await fetch(
    API_URL + "/api/keyboards/" + keyboardId + "/keymaps",
  );
  if (response.status !== 200) {
    throw new Error(`Error fetching data: ${response.status}`);
  }

  const responseJson = await response.json();
  return responseJson.keymaps;

  // return response.json();
}

export async function getTotalCounts(keyboardId, date) {
  let query = "";
  if (date) {
    query = `?date=${date.format("YYYY-MM-DD")}`;
  }
  const response = await fetch(
    API_URL + "/api/keyboards/" + keyboardId + "/totalCounts" + query,
  );
  if (response.status !== 200) {
    throw new Error(`Error fetching data: ${response.status}`);
  }

  const responseJson = await response.json();
  return responseJson;
}

export async function getCharacterCounts(keyboardId, date) {
  let query = "";
  if (date) {
    query = `?date=${date.format("YYYY-MM-DD")}`;
  }

  const response = await fetch(
    API_URL + "/api/keyboards/" + keyboardId + "/characterCounts" + query,
  );
  if (response.status !== 200) {
    throw new Error(`Error fetching data: ${response.status}`);
  }

  const responseJson = await response.json();
  return responseJson;
}

export async function getHandAndFingerUsage(keyboardId) {
  const response = await fetch(
    API_URL + "/api/keyboards/" + keyboardId + "/handAndFingerUsage",
  );
  if (response.status !== 200) {
    throw new Error(`Error fetching data: ${response.status}`);
  }

  const responseJson = await response.json();
  return responseJson;
}
