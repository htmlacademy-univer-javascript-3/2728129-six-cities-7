import {cleanup, render, screen} from '@testing-library/react';
import {afterEach, describe, expect, it} from 'vitest';
import {MemoryRouter} from 'react-router-dom';
import {Provider} from 'react-redux';
import {createTestStore} from './store';
import {offer, review} from './fixtures';
import PlaceCard from '../components/place-card/place-card';
import OfferList from '../components/offer-list/offer-list';
import ReviewItem from '../components/review-item/review-item';
import ReviewList from '../components/review-list/review-list';
import CityList from '../components/city-list/city-list';
import Spinner from '../components/spinner/spinner';
import EmptyOffers from '../components/empty-offers/empty-offers';
import NotFoundPage from '../pages/not-found-page/not-found-page';
import {cities} from '../const';

afterEach(cleanup);
const wrap = (element: JSX.Element) => render(<Provider store={createTestStore()}><MemoryRouter>{element}</MemoryRouter></Provider>);
describe('Simple components', () => {
  it('renders offer data and the details link', () => {
    wrap(<PlaceCard offer={offer} />);
    expect(screen.getByRole('heading', {name: offer.title})).toBeInTheDocument();
    expect(screen.getByRole('img', {name: offer.title})).toHaveAttribute('src', offer.previewImage);
    expect(screen.getByText('€120')).toBeInTheDocument();
    expect(screen.getByRole('heading').querySelector('a')).toHaveAttribute('href', `/offer/${offer.id}`);
  });
  it('renders all cards and supports the nearby layout', () => {
    const {container} = wrap(<OfferList offers={[offer, {...offer, id: '2'}]} variant="near-places" />);
    expect(screen.getAllByRole('article')).toHaveLength(2);
    expect(container.querySelector('.near-places__list')).toBeInTheDocument();
  });
  it('renders review author, text and date', () => {
    wrap(<ReviewItem review={review} />);
    expect(screen.getByText(review.user.name)).toBeInTheDocument();
    expect(screen.getByText(review.comment)).toBeInTheDocument();
    expect(screen.getByText('October 2026')).toHaveAttribute('datetime', review.date);
  });
  it('limits reviews to ten newest while showing the total', () => {
    const reviews = Array.from({length: 12}, (_, index) => ({...review, id: String(index), comment: `Review ${index}`, date: `2026-10-${String(index + 1).padStart(2, '0')}T12:00:00Z`}));
    wrap(<ReviewList reviews={reviews} />);
    expect(screen.getByRole('heading')).toHaveTextContent('12');
    expect(screen.getAllByRole('listitem')).toHaveLength(10);
    expect(screen.getAllByRole('listitem')[0]).toHaveTextContent('Review 11');
    expect(screen.queryByText('Review 0')).not.toBeInTheDocument();
  });
  it('renders six cities and marks the selected city', () => {
    wrap(<CityList cities={cities} selectedCity="Paris" onChange={() => undefined} />);
    expect(screen.getAllByRole('link')).toHaveLength(6);
    expect(screen.getByRole('link', {name: 'Paris'})).toHaveAttribute('aria-current', 'page');
  });
  it('renders loading, empty city and recovery link', () => {
    wrap(<><Spinner /><EmptyOffers city="Paris" /><NotFoundPage /></>);
    expect(screen.getByRole('status')).toHaveTextContent('Loading');
    expect(screen.getByText(/We could not find/)).toHaveTextContent('Paris');
    expect(screen.getByRole('link', {name: 'Back to home'})).toHaveAttribute('href', '/');
  });
});
