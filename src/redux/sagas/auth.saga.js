import { call, put, takeLatest } from 'redux-saga/effects';
import { LOGIN_REQUEST } from '../types/auth.types';
import { loginFailure, loginSuccess } from '../actions/auth.actions';
import { authApi } from '../../api/AllApis';

function* loginSaga(action) {
  try {
    const response = yield call(authApi.login, action.payload);
    
    if (response.success && response.status === 200) {
      const { token, data, message } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('RCI6IkpXVCJ9', token);
      
      // Pass both user data and message to reducer
      yield put(loginSuccess({ 
        user: data, 
        message: message 
      }));
    } else {
      // Handle API errors properly
      const errorMessage = response.error?.message || 
                          response.error || 
                          'Login failed';
      yield put(loginFailure(errorMessage));
    }
  } catch (error) {
    console.error('Login saga error:', error);
    yield put(loginFailure('Network error or server unavailable'));
  }
}

export default function* watchAuthSaga() {
  yield takeLatest(LOGIN_REQUEST, loginSaga);
}