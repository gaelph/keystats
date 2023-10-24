import {
  ActionTypes,
  LoadingAction,
  ErrorAction,
  DataAction,
} from "./constants.js";

export interface State<T> {
  loading: boolean;
  error: Error | null;
  data: T | null;
}

export default function dataReducer<T>(
  state: State<T>,
  action: LoadingAction | ErrorAction | DataAction<T>,
) {
  switch (action.type) {
    case ActionTypes.SetLoading:
      return { ...state, loading: action.payload };

    case ActionTypes.SetError:
      return { ...state, error: action.payload };

    case ActionTypes.SetData:
      return { ...state, data: action.payload };

    default:
      return state;
  }
}
