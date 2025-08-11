import {
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT,
  CLEAR_ERROR,
} from "../types/auth.types";

const initialState = {
  user: null,
  loading: false,
  error: null,
  success: false,
  message: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        success: false,
        message: null,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        message: action.payload.message,
        loading: false,
        success: true,
        error: null,
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        error: action.payload,
        loading: false,
        success: false,
        message: null,
      };
    case LOGOUT:
      return {
        ...initialState,
      };
    case CLEAR_ERROR:
      return {
        ...state,
        error: null,
        message: null,
      };
    default:
      return state;
  }
};

export default authReducer;
