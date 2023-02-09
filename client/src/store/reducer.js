import { SET_LOADING, SET_ERROR, SET_DATA } from "./constants";

export default function dataReducer(state, action) {
  switch (action.type) {
    case SET_LOADING:
      return { ...state, loading: action.payload };

    case SET_ERROR:
      return { ...state, error: action.payload };

    case SET_DATA:
      return { ...state, data: action.payload };

    default:
      return state;
  }
}
