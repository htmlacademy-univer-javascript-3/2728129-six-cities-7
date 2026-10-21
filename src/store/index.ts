import {isAxiosError} from 'axios';
import {configureStore} from '@reduxjs/toolkit';
import {setUser} from './action';
import {reducer} from './reducer';
import {createAPI} from '../services/api';
export const api = createAPI();
export const store = configureStore({reducer, middleware: (getDefaultMiddleware) => getDefaultMiddleware({thunk: {extraArgument: api}})});
export type State = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

api.interceptors.response.use((response) => response, (error: unknown) => {
  if (isAxiosError(error) && error.response?.status === 401) {
    store.dispatch(setUser(null));
  }
  return Promise.reject(error);
});
