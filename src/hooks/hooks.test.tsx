import {act, cleanup, renderHook} from '@testing-library/react';
import {Provider} from 'react-redux';
import {ReactNode} from 'react';
import {afterEach, expect, it} from 'vitest';
import {createTestStore} from '../test/store';
import {useAppDispatch, useAppSelector} from './index';
import {changeCity} from '../store/action';
afterEach(cleanup);
it('typed hooks dispatch actions and subscribe to the store', () => {
  const store = createTestStore();
  const wrapper = ({children}: {children: ReactNode}) => <Provider store={store}>{children}</Provider>;
  const {result} = renderHook(() => ({city: useAppSelector((state) => state.cityProcess), dispatch: useAppDispatch()}), {wrapper});
  expect(result.current.city).toBe('Paris');
  act(() => {
    result.current.dispatch(changeCity('Amsterdam'));
  });
  expect(result.current.city).toBe('Amsterdam');
});
