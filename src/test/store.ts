import {configureStore} from '@reduxjs/toolkit';
import {api, State} from '../store';
import {reducer} from '../store/reducer';

export const createTestStore = (overrides: Partial<State> = {}) => {
  const initial = reducer(undefined, {type: 'init'});
  return configureStore({
    reducer,
    preloadedState: {...initial, offersData: {...initial.offersData, isLoading: false, favoritesStatus: 'ready'}, userProcess: {...initial.userProcess, authorizationStatus: 'NoAuth'}, ...overrides},
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({thunk: {extraArgument: api}}),
  });
};
