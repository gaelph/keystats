import { ActionTypes, Action } from "./constants.js";

export function setLoading(
  value: boolean,
): Action<ActionTypes.SetLoading, boolean> {
  return { type: ActionTypes.SetLoading, payload: value };
}

export function setError(value: Error): Action<ActionTypes.SetError, Error> {
  return { type: ActionTypes.SetError, payload: value };
}

export function setData<T>(data: T): Action<ActionTypes.SetData, T> {
  return { type: ActionTypes.SetData, payload: data };
}
