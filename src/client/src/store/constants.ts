export enum ActionTypes {
  SetLoading = "set_loading",
  SetError = "set_error",
  SetData = "set_data",
}

export type Action<A extends ActionTypes, P> = {
  type: A;
  payload: P;
};

export type LoadingAction = Action<ActionTypes.SetLoading, boolean>;
export type ErrorAction = Action<ActionTypes.SetError, Error>;
export type DataAction<T> = Action<ActionTypes.SetData, T>;
