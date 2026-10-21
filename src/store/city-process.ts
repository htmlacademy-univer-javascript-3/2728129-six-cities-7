import {createReducer} from '@reduxjs/toolkit';
import {changeCity} from './action';
export const cityProcess = createReducer('Paris', (builder) => {
  builder.addCase(changeCity, (_state, action) => action.payload);
});
