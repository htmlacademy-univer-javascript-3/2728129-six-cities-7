import {createReducer} from '@reduxjs/toolkit';
import {Offer} from '../types/offer';
import {fillOffers} from './action';
import {fetchOffers} from './api-actions';
const initialState: {offers: Offer[]; isLoading: boolean; error: string | null} = {offers: [], isLoading: true, error: null};
export const offersData = createReducer(initialState, (builder) => {
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
});
