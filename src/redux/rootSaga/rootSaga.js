import { all } from 'redux-saga/effects';
import watchAuthSaga from '../sagas/auth.saga';

export default function* rootSaga() {
  yield all([
    watchAuthSaga(),
  ]);
}
