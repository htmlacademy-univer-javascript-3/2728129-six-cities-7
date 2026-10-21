import React from 'react';
import {Provider} from 'react-redux';
import {store} from './store';
import {fetchOffers, checkAuth} from './store/api-actions';
import ReactDOM from 'react-dom/client';
import App from './components/app/app';


void store.dispatch(checkAuth());
void store.dispatch(fetchOffers());

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}><App /></Provider>
  </React.StrictMode>
);
