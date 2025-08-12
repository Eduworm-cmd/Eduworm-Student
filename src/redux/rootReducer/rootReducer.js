import { combineReducers } from 'redux';
import authReducer from '../reducers/auth.reducer';
import userDataReducer from '../slice/userData';

const rootReducer = combineReducers({
  auth: authReducer,
  userData: userDataReducer
});

export default rootReducer;
