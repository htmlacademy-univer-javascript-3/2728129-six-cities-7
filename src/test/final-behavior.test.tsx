import {act, cleanup, fireEvent, render, screen, waitFor} from '@testing-library/react';
import {Provider} from 'react-redux';
import {MemoryRouter} from 'react-router-dom';
import MockAdapter from 'axios-mock-adapter';
import {afterEach, describe, expect, it, vi} from 'vitest';
import {api} from '../store';
import {reducer} from '../store/reducer';
import {fillOffers, setUser} from '../store/action';
import {fetchFavorites, toggleFavorite} from '../store/api-actions';
import {offer, review, user} from './fixtures';
import {Review} from '../types/review';
import {createTestStore} from './store';
import App from '../components/app/app';
import MainPage from '../pages/main-page/main-page';

vi.mock('../components/map/map', () => ({default: () => <section aria-label="Map" />}));
const mock = new MockAdapter(api);
afterEach(() => {
  cleanup(); mock.reset(); window.history.replaceState({}, '', '/');
});

describe('Final acceptance', () => {
  it('does not restore private favorites from a response arriving after logout', () => {
    let state = reducer(undefined, fetchFavorites.pending('old', undefined));
    state = reducer(state, setUser(null));
    state = reducer(state, fetchFavorites.fulfilled([{...offer, isFavorite: true}], 'old', undefined));
    expect(state.offersData.favorites).toEqual([]);
    expect(state.offersData.favoritesStatus).toBe('idle');
  });
  it('ignores a favorite mutation from the previous session', () => {
    const arg = {id: offer.id, isFavorite: false};
    let state = reducer(undefined, toggleFavorite.pending('old', arg));
    state = reducer(state, setUser(null));
    state = reducer(state, toggleFavorite.fulfilled({...offer, isFavorite: true}, 'old', arg));
    expect(state.offersData.favorites).toEqual([]);
  });
  it('filters the main page and sorts without changing source data', () => {
    const store = createTestStore();
    const cheaper = {...offer, id: 'cheap', title: 'Cheaper room', price: 80};
    store.dispatch(fillOffers([offer, cheaper, {...offer, id: 'other-city', city: {...offer.city, name: 'Amsterdam'}}]));
    render(<Provider store={store}><MemoryRouter><MainPage /></MemoryRouter></Provider>);
    expect(screen.getByText('2 places to stay in Paris')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', {name: 'Sort offers'}));
    fireEvent.click(screen.getByRole('button', {name: 'Price: low to high'}));
    expect(screen.getAllByRole('article')[0]).toHaveTextContent('Cheaper room');
    expect(store.getState().offersData.offers[0].id).toBe(offer.id);
    fireEvent.click(screen.getByRole('link', {name: 'Amsterdam'}));
    expect(screen.getByText('1 places to stay in Amsterdam')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('link', {name: 'Cologne'}));
    expect(screen.getByText('No places to stay available')).toBeInTheDocument();
    expect(screen.queryByRole('region', {name: 'Map'})).not.toBeInTheDocument();
  });
  it('retries a failed offer request in place', async () => {
    window.history.replaceState({}, '', `/offer/${offer.id}`);
    mock.onGet(`/offers/${offer.id}`).replyOnce(503);
    mock.onGet(`/offers/${offer.id}/nearby`).reply(200, []);
    mock.onGet(`/comments/${offer.id}`).reply(200, []);
    render(<Provider store={createTestStore()}><App /></Provider>);
    await screen.findByRole('alert');
    mock.onGet(`/offers/${offer.id}`).reply(200, offer);
    fireEvent.click(screen.getByRole('button', {name: 'Try again'}));
    expect(await screen.findByRole('heading', {name: offer.title})).toBeInTheDocument();
  });
  it('does not append a late review to another offer after navigation', async () => {
    const second = {...offer, id: 'second', title: 'Second apartment'};
    mock.onGet(`/offers/${offer.id}`).reply(200, offer);
    mock.onGet(`/offers/${offer.id}/nearby`).reply(200, [second]);
    mock.onGet(`/comments/${offer.id}`).reply(200, []);
    mock.onGet('/offers/second').reply(200, second);
    mock.onGet('/offers/second/nearby').reply(200, []);
    mock.onGet('/comments/second').reply(200, []);
    let complete: (response: [number, Review]) => void = () => undefined;
    mock.onPost(`/comments/${offer.id}`).reply(() => new Promise<[number, Review]>((resolve) => {
      complete = resolve;
    }));
    const store = createTestStore(); store.dispatch(setUser(user));
    window.history.replaceState({}, '', `/offer/${offer.id}`);
    render(<Provider store={store}><App /></Provider>);
    await screen.findByRole('heading', {name: offer.title});
    fireEvent.change(screen.getByLabelText('Your review'), {target: {value: review.comment}});
    fireEvent.click(screen.getByLabelText('4 stars'));
    fireEvent.click(screen.getByRole('button', {name: 'Submit'}));
    await waitFor(() => expect(mock.history.post).toHaveLength(1));
    fireEvent.click(screen.getByRole('heading', {name: second.title}).querySelector('a') as HTMLAnchorElement);
    await screen.findByRole('heading', {name: second.title});
    await act(async () => {
      complete([201, review]);
      await Promise.resolve();
    });
    expect(screen.queryByText(review.comment)).not.toBeInTheDocument();
  });
});
