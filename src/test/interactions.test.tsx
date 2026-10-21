import {cleanup, fireEvent, render, screen} from '@testing-library/react';
import {Provider} from 'react-redux';
import {MemoryRouter, Route, Routes} from 'react-router-dom';
import MockAdapter from 'axios-mock-adapter';
import {afterEach, describe, expect, it} from 'vitest';
import {api} from '../store';
import {createTestStore} from './store';
import {offer, user} from './fixtures';
import {fillOffers, setUser} from '../store/action';
import {fetchFavorites} from '../store/api-actions';
import {cities} from '../const';
import CityList from '../components/city-list/city-list';
import SortOptions from '../components/sort-options/sort-options';
import OfferList from '../components/offer-list/offer-list';
import BookmarkButton from '../components/bookmark-button/bookmark-button';
import Header from '../components/header/header';
import LoginPage from '../pages/login-page/login-page';
import FavoritesPage from '../pages/favorites-page/favorites-page';
import {vi} from 'vitest';

const mock = new MockAdapter(api);
afterEach(() => {
  cleanup(); mock.reset(); localStorage.clear();
});
const wrap = (element: JSX.Element, store = createTestStore()) => render(<Provider store={store}><MemoryRouter>{element}</MemoryRouter></Provider>);

describe('Controls', () => {
  it('selects a city without navigating away', () => {
    const onChange = vi.fn();
    wrap(<CityList cities={cities} selectedCity="Paris" onChange={onChange} />);
    fireEvent.click(screen.getByRole('link', {name: 'Amsterdam'}));
    expect(onChange).toHaveBeenCalledWith('Amsterdam');
  });
  it('opens sorting choices, selects an option and closes the menu', () => {
    const onChange = vi.fn();
    wrap(<SortOptions value="Popular" onChange={onChange} />);
    expect(screen.queryByRole('button', {name: 'Price: low to high'})).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', {name: 'Sort offers'}));
    fireEvent.click(screen.getByRole('button', {name: 'Price: low to high'}));
    expect(onChange).toHaveBeenCalledWith('Price: low to high');
    expect(screen.getByRole('button', {name: 'Sort offers'})).toHaveAttribute('aria-expanded', 'false');
  });
  it('reports active offer on mouse enter and clears it on leave', () => {
    const onActive = vi.fn();
    const {container} = wrap(<OfferList offers={[offer]} onActive={onActive} />);
    fireEvent.mouseEnter(screen.getByRole('article'));
    expect(onActive).toHaveBeenLastCalledWith(offer.id);
    expect(container.querySelector('[data-active-offer]')).toHaveAttribute('data-active-offer', offer.id);
    fireEvent.mouseLeave(screen.getByRole('article'));
    expect(onActive).toHaveBeenLastCalledWith(null);
  });
  it('sends guests to login when bookmarking', () => {
    wrap(<Routes><Route path="/" element={<BookmarkButton offer={offer} />} /><Route path="/login" element={<h1>Login route</h1>} /></Routes>);
    fireEvent.click(screen.getByRole('button', {name: 'To bookmarks'}));
    expect(screen.getByRole('heading', {name: 'Login route'})).toBeInTheDocument();
  });
  it('updates the bookmark icon and header counter after server success', async () => {
    mock.onPost(`/favorite/${offer.id}/1`).reply(201, {...offer, isFavorite: true});
    const store = createTestStore(); store.dispatch(setUser(user)); store.dispatch(fillOffers([offer]));
    wrap(<><Header /><BookmarkButton offer={offer} /></>, store);
    fireEvent.click(screen.getByRole('button', {name: 'To bookmarks'}));
    expect(await screen.findByRole('button', {name: 'In bookmarks'})).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('link', {name: `${user.email} 1`})).toBeInTheDocument();
  });
  it('leaves the bookmark unchanged when the server fails', async () => {
    mock.onPost().reply(503);
    const store = createTestStore(); store.dispatch(setUser(user));
    wrap(<BookmarkButton offer={offer} />, store);
    fireEvent.click(screen.getByRole('button', {name: 'To bookmarks'}));
    await screen.findByRole('alert');
    expect(screen.getByRole('button', {name: 'To bookmarks'})).toBeEnabled();
    expect(store.getState().offersData.favorites).toEqual([]);
  });
  it('shows empty favorites after removing the last offer', async () => {
    const store = createTestStore(); store.dispatch(setUser(user));
    store.dispatch(fetchFavorites.fulfilled([{...offer, isFavorite: true}], 'request', undefined));
    mock.onPost(`/favorite/${offer.id}/0`).reply(200, offer);
    wrap(<FavoritesPage />, store);
    fireEvent.click(screen.getByRole('button', {name: 'In bookmarks'}));
    expect(await screen.findByText('Nothing yet saved')).toBeInTheDocument();
  });
  it('reports logout errors and lets the user retry', async () => {
    mock.onDelete('/logout').replyOnce(503);
    const store = createTestStore(); store.dispatch(setUser(user));
    wrap(<Header />, store);
    fireEvent.click(screen.getByRole('button', {name: 'Sign out'}));
    await screen.findByRole('alert');
    expect(screen.getByRole('button', {name: 'Sign out'})).toBeEnabled();
    mock.onDelete('/logout').reply(204); mock.onGet('/offers').reply(200, []);
    fireEvent.click(screen.getByRole('button', {name: 'Sign out'}));
    expect(await screen.findByRole('link', {name: 'Sign in'})).toBeInTheDocument();
  });
});

describe('Login form', () => {
  it('logs in and redirects to the main route', async () => {
    mock.onPost('/login').reply(200, {...user, token: 'test'});
    mock.onGet('/favorite').reply(200, []); mock.onGet('/offers').reply(200, []);
    render(<Provider store={createTestStore()}><MemoryRouter initialEntries={['/login']}><Routes><Route path="/login" element={<LoginPage />} /><Route path="/" element={<h1>Home</h1>} /></Routes></MemoryRouter></Provider>);
    // Navigate redirects to /; checking the store-driven removal of the form proves the transition.
    fireEvent.change(screen.getByLabelText('Email'), {target: {value: user.email}});
    fireEvent.change(screen.getByLabelText('Password'), {target: {value: 'Test123'}});
    fireEvent.click(screen.getByRole('button', {name: 'Sign in'}));
    expect(await screen.findByRole('heading', {name: 'Home'})).toBeInTheDocument();
  });
  it('keeps form data after a rejected login', async () => {
    mock.onPost('/login').reply(400);
    wrap(<LoginPage />);
    fireEvent.change(screen.getByLabelText('Email'), {target: {value: user.email}});
    fireEvent.change(screen.getByLabelText('Password'), {target: {value: 'Test123'}});
    fireEvent.click(screen.getByRole('button', {name: 'Sign in'}));
    await screen.findByRole('alert');
    expect(screen.getByLabelText('Email')).toHaveValue(user.email);
    expect(screen.getByRole('button', {name: 'Sign in'})).toBeEnabled();
  });
});
