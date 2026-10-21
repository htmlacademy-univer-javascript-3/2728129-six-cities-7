import {createReducer} from '@reduxjs/toolkit';
import {AuthorizationStatus, User} from '../types/user';
import {setUser} from './action';
import {login, logout} from './api-actions';
const initialState: {authorizationStatus: AuthorizationStatus; user: User | null; authError: string | null; isLoggingIn: boolean} = {authorizationStatus: 'Unknown', user: null, authError: null, isLoggingIn: false};
export const userProcess = createReducer(initialState, (builder) => {
  builder.addCase(setUser, (state, action) => {
    state.user = action.payload; state.authorizationStatus = action.payload ? 'Auth' : 'NoAuth';
  });
  builder.addCase(login.pending, (state) => {
    state.isLoggingIn = true; state.authError = null;
  });
  builder.addCase(login.fulfilled, (state) => {
    state.isLoggingIn = false;
  });
  builder.addCase(login.rejected, (state) => {
    state.isLoggingIn = false; state.authError = 'Sign in failed. Check your details and try again.';
  });
  builder.addCase(logout.pending, (state) => {
    state.authError = null;
  });
  builder.addCase(logout.rejected, (state) => {
    state.authError = 'Could not sign out. Please try again.';
  });
});
