import {createReducer} from '@reduxjs/toolkit';
import {Offer} from '../types/offer';
import {changeCity, fillOffers} from './action';
import {fetchOffers} from './api-actions';

const initialState: {city: string; offers: Offer[]; isLoading: boolean; error: string | null} = {city: 'Paris', offers: [], isLoading: true, error: null};
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
});
