import {AuthInfo} from '../types/user';
import {saveToken, dropToken} from '../services/token';
import {setUser} from './action';
import {createAsyncThunk} from '@reduxjs/toolkit';
import {AxiosInstance} from 'axios';
import {Offer} from '../types/offer';
export const fetchOffers = createAsyncThunk<Offer[], undefined, {extra: AxiosInstance}>(
  'offers/fetch', async (_arg, {extra: api}) => {
    const {data} = await api.get<Offer[]>('/offers');
    return data;
  }
);

export const checkAuth = createAsyncThunk<void, undefined, {extra: AxiosInstance}>(
  'user/check', async (_arg, {extra: api, dispatch}) => {
    try {
      const {data} = await api.get<AuthInfo>('/login');
      const {token, ...user} = data;
      saveToken(token); dispatch(setUser(user));
    } catch {
      dispatch(setUser(null));
    }
  }
);
export const login = createAsyncThunk<void, {email: string; password: string}, {extra: AxiosInstance}>(
  'user/login', async (credentials, {extra: api, dispatch}) => {
    const {data} = await api.post<AuthInfo>('/login', credentials);
    const {token, ...user} = data;
    saveToken(token); dispatch(setUser(user));
    await dispatch(fetchOffers());
  }
);
export const logout = createAsyncThunk<void, undefined, {extra: AxiosInstance}>(
  'user/logout', async (_arg, {extra: api, dispatch}) => {
    await api.delete('/logout');
    dropToken(); dispatch(setUser(null));
    await dispatch(fetchOffers());
  }
);
