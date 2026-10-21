import {cleanup, render, screen} from '@testing-library/react';
import {Provider} from 'react-redux';
import {MemoryRouter, Route, Routes} from 'react-router-dom';
import {afterEach, describe, expect, it} from 'vitest';
import {createTestStore} from './store';
import {user} from './fixtures';
import {setUser} from '../store/action';
import PrivateRoute from '../components/private-route/private-route';
afterEach(cleanup);
describe('PrivateRoute', () => {
  it('waits while authorization is unknown', () => {
    const store = createTestStore();
    const initial = store.getState();
    const unknownStore = createTestStore({userProcess: {...initial.userProcess, authorizationStatus: 'Unknown'}});
    render(<Provider store={unknownStore}><MemoryRouter><PrivateRoute><h1>Private</h1></PrivateRoute></MemoryRouter></Provider>);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.queryByText('Private')).not.toBeInTheDocument();
  });
  it('renders children for authenticated users', () => {
    const store = createTestStore(); store.dispatch(setUser(user));
    render(<Provider store={store}><MemoryRouter><PrivateRoute><h1>Private</h1></PrivateRoute></MemoryRouter></Provider>);
    expect(screen.getByText('Private')).toBeInTheDocument();
  });
  it('redirects guests to login', () => {
    render(<Provider store={createTestStore()}><MemoryRouter><Routes><Route path="/" element={<PrivateRoute><h1>Private</h1></PrivateRoute>} /><Route path="/login" element={<h1>Login</h1>} /></Routes></MemoryRouter></Provider>);
    expect(screen.getByText('Login')).toBeInTheDocument();
  });
});
