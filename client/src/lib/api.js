const API_URL =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:12000";

// export async function getData() {
//   const response = await fetch(API_URL + "/log.json");
//   if (response.status !== 200) {
//     throw new Error(`Error fetching data: ${response.status}`);
//   }
//   return response.json();
// }

export async function listKeyboards() {
  const response = await fetch(API_URL + "/api/keyboards");
  if (response.status !== 200) {
    throw new Error(`Error fetching data: ${response.status}`);
  }

  const responseJson = await response.json();
  return responseJson.keyboards;
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

export async function getTotalCounts(keyboardId) {
  const response = await fetch(
    API_URL + "/api/keyboards/" + keyboardId + "/totalCounts",
  );
  if (response.status !== 200) {
    throw new Error(`Error fetching data: ${response.status}`);
  }

  const responseJson = await response.json();
  return responseJson;
}

export async function getCharacterCounts(keyboardId) {
  const response = await fetch(
    API_URL + "/api/keyboards/" + keyboardId + "/characterCounts",
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
