import {createReducer} from '@reduxjs/toolkit';
import {Offer} from '../types/offer';
import {fillOffers, setUser} from './action';
import {fetchOffers, fetchFavorites, toggleFavorite} from './api-actions';
const initialState: {offers: Offer[]; isLoading: boolean; error: string | null; favorites: Offer[]; favoritesStatus: 'idle' | 'loading' | 'ready' | 'error'; favoritesRequestId: string | null; favoriteRequests: Record<string, string>} = {offers: [], isLoading: true, error: null, favorites: [], favoritesStatus: 'idle', favoritesRequestId: null, favoriteRequests: {}};
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
  builder.addCase(fetchFavorites.pending, (state, action) => {
    state.favoritesRequestId = action.meta.requestId;
    state.favoritesStatus = 'loading';
  });
  builder.addCase(fetchFavorites.fulfilled, (state, action) => {
    if (state.favoritesRequestId !== action.meta.requestId) {
      return;
    }
    state.favorites = action.payload; state.favoritesStatus = 'ready';
  });
  builder.addCase(fetchFavorites.rejected, (state, action) => {
    if (state.favoritesRequestId !== action.meta.requestId) {
      return;
    }
    state.favoritesStatus = 'error';
  });
  builder.addCase(toggleFavorite.pending, (state, action) => {
    state.favoriteRequests[action.meta.arg.id] = action.meta.requestId;
  });
  builder.addCase(toggleFavorite.rejected, (state, action) => {
    if (state.favoriteRequests[action.meta.arg.id] === action.meta.requestId) {
      delete state.favoriteRequests[action.meta.arg.id];
    }
  });
  builder.addCase(toggleFavorite.fulfilled, (state, action) => {
    if (state.favoriteRequests[action.meta.arg.id] !== action.meta.requestId) {
      return;
    }
    delete state.favoriteRequests[action.meta.arg.id];
    const offer = action.payload;
    state.offers = state.offers.map((item) => item.id === offer.id ? {...item, isFavorite: offer.isFavorite} : item);
    state.favorites = state.favorites.filter((item) => item.id !== offer.id);
    if (offer.isFavorite) {
      state.favorites.push(offer);
    }
  });
  builder.addCase(setUser, (state, action) => {
    state.favoritesRequestId = null; state.favoriteRequests = {};
    if (!action.payload) {
      state.favorites = []; state.favoritesStatus = 'idle';
      state.offers.forEach((offer) => {
        offer.isFavorite = false;
      });
    }
  });
});
