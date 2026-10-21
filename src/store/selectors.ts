import {createSelector} from '@reduxjs/toolkit';
import {State} from './index';
export const selectOffers = (state: State) => state.offersData.offers;
export const selectCity = (state: State) => state.cityProcess;
export const selectCityOffers = createSelector([selectOffers, selectCity], (offers, city) => offers.filter((offer) => offer.city.name === city));
export const selectFavoriteCount = (state: State) => state.offersData.favorites.length;
