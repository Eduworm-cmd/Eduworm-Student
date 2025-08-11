import { CLEAR_ERROR, LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT } from "../types/auth.types";

export const loginRequest = (formData) => ({
  type: LOGIN_REQUEST,
  payload: formData,
});

export const loginSuccess = (userData) => ({
  type: LOGIN_SUCCESS,
  payload: userData,
});

export const loginFailure = (error) => ({
  type: LOGIN_FAILURE,
  payload: error,
});

export const logout = () => ({
  type: LOGOUT,
});

export const clearError = () => ({
  type: CLEAR_ERROR,
});