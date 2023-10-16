const API_URL =
  process.env.NODE_ENV === "production"
    ? window.location.origin
    : "http://localhost:12000";

function toUrl(pathTemplate, params, query) {
  let path = pathTemplate;
  for (const key in params) {
    path = path.replace(`:${key}`, encodeURIComponent(params[key]));
  }

  const url = new URL(path, API_URL);
  for (const key in query) {
    url.searchParams.append(key, query[key]);
  }

  return url.toString();
}

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
    toUrl("/api/keyboards/:keyboardId/available-dates", { keyboardId }),
  );
  if (response.status !== 200) {
    throw new Error(`Error fetching data: ${response.status}`);
  }

  const responseJson = await response.json();
  return responseJson.dates;
}

export async function getKeyboardKeymaps(keyboardId) {
  const response = await fetch(
    toUrl("/api/keyboards/:keyboardId/keymaps", { keyboardId }),
  );
  if (response.status !== 200) {
    throw new Error(`Error fetching data: ${response.status}`);
  }

  const responseJson = await response.json();
  return responseJson.keymaps;

  // return response.json();
}

export async function getTotalCounts(keyboardId, filters) {
  const response = await fetch(
    toUrl("/api/keyboards/:keyboardId/totalCounts", { keyboardId }, filters),
  );
  if (response.status !== 200) {
    throw new Error(`Error fetching data: ${response.status}`);
  }

  const responseJson = await response.json();
  return responseJson;
}

export async function getCharacterCounts(keyboardId, filters) {
  const response = await fetch(
    toUrl(
      "/api/keyboards/:keyboardId/characterCounts",
      { keyboardId },
      filters,
    ),
  );
  if (response.status !== 200) {
    throw new Error(`Error fetching data: ${response.status}`);
  }

  const responseJson = await response.json();
  return responseJson;
}

export async function getHandAndFingerUsage(keyboardId, filters) {
  const response = await fetch(
    toUrl(
      "/api/keyboards/:keyboardId/handAndFingerUsage",
      { keyboardId },
      filters,
    ),
  );
  if (response.status !== 200) {
    throw new Error(`Error fetching data: ${response.status}`);
  }

  const responseJson = await response.json();
  return responseJson;
}
