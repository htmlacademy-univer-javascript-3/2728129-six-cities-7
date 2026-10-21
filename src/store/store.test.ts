import {configureStore} from '@reduxjs/toolkit';
import MockAdapter from 'axios-mock-adapter';
import {beforeEach, describe, expect, it} from 'vitest';
import {createAPI} from '../services/api';
import {dropToken, getToken, saveToken} from '../services/token';
import {reducer} from './reducer';
import {changeCity, setUser} from './action';
import {checkAuth, fetchOffers, login, logout} from './api-actions';
import {sortOffers} from '../utils';
import {Offer} from '../types/offer';

const user = {email: 'test@example.com', name: 'Test', avatarUrl: '/avatar.png', isPro: false};
const api = createAPI();
const mock = new MockAdapter(api);
const makeStore = () => configureStore({reducer, middleware: (getDefaultMiddleware) => getDefaultMiddleware({thunk: {extraArgument: api}})});

beforeEach(() => {
  mock.reset(); dropToken();
});

describe('Offers and authentication', () => {
  it('starts in Paris and updates the selected city', () => {
    const store = makeStore();
    expect(store.getState().cityProcess).toBe('Paris');
    store.dispatch(changeCity('Amsterdam'));
    expect(store.getState().cityProcess).toBe('Amsterdam');
  });
  it('finishes loading after a successful response', async () => {
    mock.onGet('/offers').reply(200, []);
    const store = makeStore();
    await store.dispatch(fetchOffers());
    expect(store.getState().offersData).toMatchObject({isLoading: false, error: null, offers: []});
  });
  it('handles a failed load and recovers on retry', async () => {
    mock.onGet('/offers').replyOnce(503);
    const store = makeStore();
    await store.dispatch(fetchOffers());
    expect(store.getState().offersData.error).toBeTruthy();
    expect(store.getState().offersData.isLoading).toBe(false);
    mock.onGet('/offers').reply(200, []);
    await store.dispatch(fetchOffers());
    expect(store.getState().offersData.error).toBeNull();
  });
  it('treats a 401 as a guest and clears an expired token', async () => {
    saveToken('expired');
    mock.onGet('/login').reply(401);
    const store = makeStore();
    await store.dispatch(checkAuth());
    expect(store.getState().userProcess.authorizationStatus).toBe('NoAuth');
    expect(getToken()).toBe('');
  });
  it('saves login token and sends it with subsequent requests', async () => {
    mock.onPost('/login', {email: user.email, password: 'Test123'}).reply(200, {...user, token: 'test-token'});
    mock.onGet('/offers').reply((config) => {
      expect(config.headers?.['X-Token']).toBe('test-token');
      return [200, []];
    });
    const store = makeStore();
    await store.dispatch(login({email: user.email, password: 'Test123'}));
    expect(getToken()).toBe('test-token');
    expect(store.getState().userProcess).toMatchObject({authorizationStatus: 'Auth', user, isLoggingIn: false});
  });
  it('shows a recoverable login error', async () => {
    mock.onPost('/login').reply(400);
    const store = makeStore();
    await store.dispatch(login({email: user.email, password: 'Test123'}));
    expect(store.getState().userProcess.authError).toBeTruthy();
    expect(store.getState().userProcess.isLoggingIn).toBe(false);
  });
  it('restores an existing authenticated session', async () => {
    saveToken('valid');
    mock.onGet('/login').reply(200, {...user, token: 'valid'});
    const store = makeStore();
    await store.dispatch(checkAuth());
    expect(store.getState().userProcess.authorizationStatus).toBe('Auth');
  });
  it('clears the session after logout', async () => {
    saveToken('valid');
    mock.onDelete('/logout').reply(204);
    mock.onGet('/offers').reply(200, []);
    const store = makeStore();
    store.dispatch(setUser(user));
    await store.dispatch(logout());
    expect(store.getState().userProcess).toMatchObject({authorizationStatus: 'NoAuth', user: null});
    expect(getToken()).toBe('');
  });
});

it('sorts by price and rating while preserving popular order', () => {
  const offers = [{id: 'a', price: 120, rating: 4}, {id: 'b', price: 80, rating: 5}, {id: 'c', price: 180, rating: 3}] as Offer[];
  expect(sortOffers(offers, 'Price: low to high').map((offer) => offer.id)).toEqual(['b', 'a', 'c']);
  expect(sortOffers(offers, 'Price: high to low').map((offer) => offer.id)).toEqual(['c', 'a', 'b']);
  expect(sortOffers(offers, 'Top rated first').map((offer) => offer.id)).toEqual(['b', 'a', 'c']);
  expect(sortOffers(offers, 'Popular').map((offer) => offer.id)).toEqual(['a', 'b', 'c']);
  expect(offers.map((offer) => offer.id)).toEqual(['a', 'b', 'c']);
});
