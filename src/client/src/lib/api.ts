import { KeyboardDTO } from "keystats-common";
import type {
  FilterQuery,
  KeyboardListBody,
  KeymapsBody,
  CharacterCountBody,
  RepetitionsBody,
  TotalCountBody,
} from "keystats-common/dto/keyboard";

export type Keyboard = KeyboardListBody["keyboards"][number];
export type KeymapLayers = KeymapsBody["keymaps"];

const API_URL =
  process.env.NODE_ENV === "production"
    ? window.location.origin
    : "http://localhost:12000";

function toUrl(
  pathTemplate: string,
  params: Record<string, string | number>,
  query?: Record<string, string | number>,
) {
  let path = pathTemplate;
  for (const key in params) {
    path = path.replace(`:${key}`, encodeURIComponent(params[key]));
  }

  const url = new URL(path, API_URL);
  for (const key in query) {
    url.searchParams.append(key, query[key].toString());
  }

  return url.toString();
}

export async function listKeyboards(): Promise<Keyboard[]> {
  const response = await fetch(API_URL + "/api/keyboards");
  if (response.status !== 200) {
    throw new Error(`Error fetching data: ${response.status}`);
  }

  const responseJson = await response.json();
  try {
    const res: KeyboardListBody =
      KeyboardDTO.keyboardListBody.parse(responseJson);

    return res.keyboards || [];
  } catch (e) {
    console.error(e);
    throw new Error(`Api response is invalid: ${responseJson}`);
  }
}

export async function getDates(keyboardId: number): Promise<Date[]> {
  const response = await fetch(
    toUrl("/api/keyboards/:keyboardId/available-dates", { keyboardId }),
  );
  if (response.status !== 200) {
    throw new Error(`Error fetching data: ${response.status}`);
  }

  const responseJson = await response.json();
  try {
    const res = KeyboardDTO.datesBody.parse(responseJson);
    return res.dates || [];
  } catch (e) {
    throw new Error(`Api response is invalid: ${responseJson}`);
  }
}

export async function getKeyboardKeymaps(
  keyboardId: number,
): Promise<KeymapLayers> {
  const response = await fetch(
    toUrl("/api/keyboards/:keyboardId/keymaps", { keyboardId }),
  );
  if (response.status !== 200) {
    throw new Error(`Error fetching data: ${response.status}`);
  }

  const responseJson = await response.json();

  try {
    const res = KeyboardDTO.keymapsBody.parse(responseJson);

    return res.keymaps;
  } catch (error) {
    console.error(error);
    throw new Error(`Api response is invalid: ${responseJson}`);
  }
}

export async function getTotalCounts(
  keyboardId: number,
  filters: FilterQuery,
): Promise<TotalCountBody> {
  const response = await fetch(
    toUrl(
      "/api/keyboards/:keyboardId/totalCounts",
      { keyboardId },
      KeyboardDTO.serializeFilterQuery(filters),
    ),
  );
  if (response.status !== 200) {
    throw new Error(`Error fetching data: ${response.status}`);
  }

  const responseJson = await response.json();
  try {
    const res = KeyboardDTO.totalCountBody.parse(responseJson);

    return res;
  } catch (error) {
    console.error(error);
    throw new Error(`Api response is invalid: ${responseJson}`);
  }
  return responseJson;
}

export async function getCharacterCounts(
  keyboardId: number,
  filters: FilterQuery,
): Promise<CharacterCountBody> {
  const response = await fetch(
    toUrl(
      "/api/keyboards/:keyboardId/characterCounts",
      { keyboardId },
      KeyboardDTO.serializeFilterQuery(filters),
    ),
  );
  if (response.status !== 200) {
    throw new Error(`Error fetching data: ${response.status}`);
  }

  const responseJson = await response.json();
  try {
    const res = KeyboardDTO.characterCountBody.parse(responseJson);
    return res;
  } catch (error) {
    console.error(error);
    throw new Error(`Api response is invalid: ${responseJson}`);
  }
}

export async function getHandAndFingerUsage(
  keyboardId: number,
  filters: FilterQuery,
): Promise<RepetitionsBody> {
  const response = await fetch(
    toUrl(
      "/api/keyboards/:keyboardId/handAndFingerUsage",
      { keyboardId },
      KeyboardDTO.serializeFilterQuery(filters),
    ),
  );
  if (response.status !== 200) {
    throw new Error(`Error fetching data: ${response.status}`);
  }

  const responseJson = await response.json();
  try {
    const res = KeyboardDTO.repetitionsBody.parse(responseJson);
    return res;
  } catch (error) {
    console.error(error);
    throw new Error(`Api response is invalid: ${responseJson}`);
  }
}
