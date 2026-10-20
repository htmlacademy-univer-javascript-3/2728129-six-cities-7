import React from 'react';
import {Provider} from 'react-redux';
import {store} from './store';
import {fillOffers} from './store/action';
import ReactDOM from 'react-dom/client';
import App from './components/app/app';

import {offers} from './mocks/offers';
import {reviews} from './mocks/reviews';

store.dispatch(fillOffers(offers));

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}><App offers={offers} reviews={reviews} /></Provider>
  </React.StrictMode>
);
