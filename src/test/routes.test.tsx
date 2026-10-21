import {cleanup, render, screen} from '@testing-library/react';
import {Provider} from 'react-redux';
import MockAdapter from 'axios-mock-adapter';
import {afterEach, describe, expect, it, vi} from 'vitest';
import App from '../components/app/app';
import {createTestStore} from './store';
import {api} from '../store';
import {offer, review} from './fixtures';
import {fillOffers} from '../store/action';

vi.mock('../components/map/map', () => ({default: () => <section aria-label="Map" />}));
const mock = new MockAdapter(api);
afterEach(() => {
  cleanup(); mock.reset(); window.history.replaceState({}, '', '/');
});
const open = (path: string) => {
  window.history.replaceState({}, '', path);
  const store = createTestStore();
  store.dispatch(fillOffers([offer]));
  render(<Provider store={store}><App /></Provider>);
};
describe('Application routes', () => {
  it('renders the main page', () => {
    open('/');
    expect(screen.getByText('1 places to stay in Paris')).toBeInTheDocument();
  });
  it('renders login', () => {
    open('/login');
    expect(screen.getByRole('heading', {name: 'Sign in'})).toBeInTheDocument();
  });
  it('redirects a guest away from favorites', () => {
    open('/favorites');
    expect(screen.getByRole('heading', {name: 'Sign in'})).toBeInTheDocument();
    expect(window.location.pathname).toBe('/login');
  });
  it('renders unknown routes as 404', () => {
    open('/missing');
    expect(screen.getByRole('heading', {name: '404 Not Found'})).toBeInTheDocument();
  });
  it('loads the selected offer and its related data', async () => {
    mock.onGet(`/offers/${offer.id}`).reply(200, offer);
    mock.onGet(`/offers/${offer.id}/nearby`).reply(200, []);
    mock.onGet(`/comments/${offer.id}`).reply(200, [review]);
    open(`/offer/${offer.id}`);
    expect(await screen.findByRole('heading', {name: offer.title})).toBeInTheDocument();
    expect(screen.getByText(review.comment)).toBeInTheDocument();
    expect(screen.queryByLabelText('Your review')).not.toBeInTheDocument();
  });
  it('handles a nonexistent offer as 404', async () => {
    mock.onGet().reply(404);
    open('/offer/missing');
    expect(await screen.findByRole('heading', {name: '404 Not Found'})).toBeInTheDocument();
  });
});
