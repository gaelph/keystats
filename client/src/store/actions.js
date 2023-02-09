import { SET_LOADING, SET_ERROR, SET_DATA } from "./constants";

export function setLoading(value) {
  return { type: SET_LOADING, payload: value };
}

export function setError(value) {
  return { type: SET_ERROR, payload: value };
}

export function setData(data) {
  return { type: SET_DATA, payload: data };
}
