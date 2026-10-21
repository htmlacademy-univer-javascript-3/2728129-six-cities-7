import {describe, expect, it} from 'vitest';
import {reducer} from './reducer';
import {changeCity, fillOffers, setUser} from './action';
import {fetchFavorites, fetchOffers, login, logout, toggleFavorite} from './api-actions';
import {offer, user} from '../test/fixtures';
import {selectFavoriteCount} from './selectors';

describe('Domain reducers', () => {
  it('preserves state for unknown actions', () => {
    const state = reducer(undefined, {type: 'init'});
    expect(reducer(state, {type: 'unknown'})).toBe(state);
    expect(state.cityProcess).toBe('Paris');
    expect(state.userProcess.authorizationStatus).toBe('Unknown');
  });
  it('keeps city changes isolated from the offers domain', () => {
    const state = reducer(undefined, fillOffers([offer]));
    const next = reducer(state, changeCity('Amsterdam'));
    expect(next.offersData).toBe(state.offersData);
    expect(next.cityProcess).toBe('Amsterdam');
  });
  it('tracks loading, failure and retry without discarding offers', () => {
    const state = reducer(undefined, fillOffers([offer]));
    const failed = reducer(state, fetchOffers.rejected(new Error('offline'), 'request', undefined));
    expect(failed.offersData.isLoading).toBe(false);
    expect(failed.offersData.error).toBeTruthy();
    const pending = reducer(failed, fetchOffers.pending('retry', undefined));
    expect(pending.offersData.error).toBeNull();
    expect(pending.offersData.offers).toEqual([offer]);
    expect(reducer(pending, fetchOffers.fulfilled([], 'retry', undefined)).offersData.isLoading).toBe(false);
  });
  it('synchronizes favorites, cards and counter in both directions', () => {
    let state = reducer(undefined, fillOffers([offer]));
    state = reducer(state, fetchFavorites.pending('request', undefined));
    expect(state.offersData.favoritesStatus).toBe('loading');
    state = reducer(state, fetchFavorites.fulfilled([], 'request', undefined));
    state = reducer(state, toggleFavorite.pending('add', {id: offer.id, isFavorite: false}));
    state = reducer(state, toggleFavorite.fulfilled({...offer, isFavorite: true}, 'add', {id: offer.id, isFavorite: false}));
    expect(selectFavoriteCount(state)).toBe(1);
    expect(state.offersData.offers[0].isFavorite).toBe(true);
    state = reducer(state, toggleFavorite.pending('remove', {id: offer.id, isFavorite: true}));
    state = reducer(state, toggleFavorite.fulfilled(offer, 'remove', {id: offer.id, isFavorite: true}));
    expect(selectFavoriteCount(state)).toBe(0);
    expect(state.offersData.offers[0].isFavorite).toBe(false);
  });
  it('clears private data when the session ends', () => {
    let state = reducer(undefined, setUser(user));
    state = reducer(state, fetchFavorites.pending('request', undefined));
    state = reducer(state, fetchFavorites.fulfilled([{...offer, isFavorite: true}], 'request', undefined));
    state = reducer(state, setUser(null));
    expect(state.userProcess).toMatchObject({user: null, authorizationStatus: 'NoAuth'});
    expect(state.offersData.favorites).toEqual([]);
  });
  it('tracks authentication and favorites errors', () => {
    const credentials = {email: user.email, password: 'Test123'};
    let state = reducer(undefined, login.pending('request', credentials));
    expect(state.userProcess.isLoggingIn).toBe(true);
    state = reducer(state, login.rejected(new Error('offline'), 'request', credentials));
    expect(state.userProcess.isLoggingIn).toBe(false);
    expect(state.userProcess.authError).toBeTruthy();
    state = reducer(state, logout.pending('logout', undefined));
    expect(state.userProcess.authError).toBeNull();
    state = reducer(state, logout.rejected(new Error('offline'), 'logout', undefined));
    expect(state.userProcess.authError).toBeTruthy();
    state = reducer(state, fetchFavorites.pending('favorites', undefined));
    state = reducer(state, fetchFavorites.rejected(new Error('offline'), 'favorites', undefined));
    expect(state.offersData.favoritesStatus).toBe('error');
  });
});
