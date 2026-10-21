import {describe, expect, it} from 'vitest';
import {reducer} from './reducer';
import {changeCity, fillOffers, setUser} from './action';
import {selectCityOffers} from './selectors';
import {Offer} from '../types/offer';

describe('Memoized city offers', () => {
  it('reuses the same array when unrelated authentication changes', () => {
    const state = reducer(undefined, {type: 'init'});
    const offers = selectCityOffers(state);
    const next = reducer(state, setUser({name: 'Test', email: 'test@example.com', avatarUrl: '', isPro: false}));
    expect(selectCityOffers(next)).toBe(offers);
  });
  it('recomputes only for a new city or offers', () => {
    const offer = {id: '1', city: {name: 'Amsterdam'}} as Offer;
    const state = reducer(undefined, fillOffers([offer]));
    expect(selectCityOffers(state)).toEqual([]);
    const next = reducer(state, changeCity('Amsterdam'));
    expect(selectCityOffers(next)).toEqual([offer]);
    expect(selectCityOffers(next)).toBe(selectCityOffers(next));
  });
});
