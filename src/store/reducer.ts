import {AuthorizationStatus, User} from '../types/user';
import {createReducer} from '@reduxjs/toolkit';
import {Offer} from '../types/offer';
import {changeCity, fillOffers, setUser} from './action';
import {fetchOffers, login, logout} from './api-actions';

const initialState: {city: string; offers: Offer[]; isLoading: boolean; error: string | null; authorizationStatus: AuthorizationStatus; user: User | null; authError: string | null; isLoggingIn: boolean} = {city: 'Paris', offers: [], isLoading: true, error: null, authorizationStatus: 'Unknown', user: null, authError: null, isLoggingIn: false};
export const reducer = createReducer(initialState, (builder) => {
  builder.addCase(changeCity, (state, action) => {
    state.city = action.payload;
  });
  builder.addCase(fillOffers, (state, action) => {
    state.offers = action.payload;
  });
  builder.addCase(fetchOffers.pending, (state) => {
    state.isLoading = true; state.error = null;
  });
  builder.addCase(fetchOffers.fulfilled, (state, action) => {
    state.offers = action.payload; state.isLoading = false;
  });
  builder.addCase(fetchOffers.rejected, (state) => {
    state.isLoading = false; state.error = 'Could not load offers. Please try again.';
  });
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
