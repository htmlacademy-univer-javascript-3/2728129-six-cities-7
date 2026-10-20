import {createReducer} from '@reduxjs/toolkit';
import {Offer} from '../types/offer';
import {changeCity, fillOffers} from './action';

const initialState: {city: string; offers: Offer[]} = {city: 'Paris', offers: []};

export const reducer = createReducer(initialState, (builder) => {
  builder.addCase(changeCity, (state, action) => {
    state.city = action.payload;
  });
  builder.addCase(fillOffers, (state, action) => {
    state.offers = action.payload;
  });
});
