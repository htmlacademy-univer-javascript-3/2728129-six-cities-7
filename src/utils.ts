import {Offer} from './types/offer';

export function sortOffers(offers: Offer[], sort: string): Offer[] {
  const sorted = [...offers];
  switch (sort) {
    case 'Price: low to high': return sorted.sort((a, b) => a.price - b.price);
    case 'Price: high to low': return sorted.sort((a, b) => b.price - a.price);
    case 'Top rated first': return sorted.sort((a, b) => b.rating - a.rating);
    default: return sorted;
  }
}
