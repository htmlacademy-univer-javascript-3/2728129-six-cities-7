import {cleanup, render} from '@testing-library/react';
import {afterEach, expect, it} from 'vitest';
import Map from './map';
import {offer} from '../../test/fixtures';
afterEach(cleanup);
it('updates active marker without recreating the map or marker node', () => {
  const offers = [offer];
  const {container, rerender, unmount} = render(<Map city={offer.city} offers={offers} />);
  const marker = container.querySelector('.leaflet-marker-icon');
  expect(marker).toHaveAttribute('src', '/img/pin.svg');
  rerender(<Map city={offer.city} offers={offers} activeId={offer.id} />);
  expect(container.querySelector('.leaflet-marker-icon')).toBe(marker);
  expect(marker).toHaveAttribute('src', '/img/pin-active.svg');
  rerender(<Map city={offer.city} offers={[]} />);
  expect(container.querySelector('.leaflet-marker-icon')).toBeNull();
  unmount();
});
