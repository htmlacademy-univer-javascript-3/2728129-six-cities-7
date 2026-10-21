import MockAdapter from 'axios-mock-adapter';
import {afterEach, describe, expect, it} from 'vitest';
import {api} from './index';
import {createTestStore} from '../test/store';
import {offer, review} from '../test/fixtures';
import {fetchFavorites, postReview, toggleFavorite} from './api-actions';

const mock = new MockAdapter(api);
afterEach(() => mock.reset());
describe('Server operations', () => {
  it('loads favorites from their own endpoint', async () => {
    mock.onGet('/favorite').reply(200, [{...offer, isFavorite: true}]);
    const store = createTestStore();
    await store.dispatch(fetchFavorites());
    expect(store.getState().offersData.favorites).toHaveLength(1);
  });
  it('uses opposite favorite status for add and remove', async () => {
    mock.onPost(`/favorite/${offer.id}/1`).reply(201, {...offer, isFavorite: true});
    mock.onPost(`/favorite/${offer.id}/0`).reply(200, offer);
    const store = createTestStore();
    await expect(store.dispatch(toggleFavorite({id: offer.id, isFavorite: false})).unwrap()).resolves.toMatchObject({isFavorite: true});
    await expect(store.dispatch(toggleFavorite({id: offer.id, isFavorite: true})).unwrap()).resolves.toMatchObject({isFavorite: false});
  });
  it('does not change favorites on a failed update', async () => {
    mock.onPost(`/favorite/${offer.id}/1`).reply(503);
    const store = createTestStore();
    await expect(store.dispatch(toggleFavorite({id: offer.id, isFavorite: false})).unwrap()).rejects.toBeTruthy();
    expect(store.getState().offersData.favorites).toEqual([]);
  });
  it('posts only rating and comment and returns the server review', async () => {
    mock.onPost(`/comments/${offer.id}`, {rating: 4, comment: review.comment}).reply(201, review);
    const store = createTestStore();
    await expect(store.dispatch(postReview({offerId: offer.id, rating: 4, comment: review.comment})).unwrap()).resolves.toEqual(review);
  });
  it('propagates review failures so the form can retry', async () => {
    mock.onPost(`/comments/${offer.id}`).reply(500);
    await expect(createTestStore().dispatch(postReview({offerId: offer.id, rating: 4, comment: review.comment})).unwrap()).rejects.toBeTruthy();
  });
});
