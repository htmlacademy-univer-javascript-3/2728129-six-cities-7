import {OfferDetails} from '../types/offer';
import {Review} from '../types/review';
import {User} from '../types/user';

export const offer: OfferDetails = {
  id: 'offer-1', title: 'Canal apartment', type: 'apartment', price: 120,
  previewImage: '/img/apartment-01.jpg', city: {name: 'Paris', location: {latitude: 48.8566, longitude: 2.35, zoom: 12}},
  location: {latitude: 48.85, longitude: 2.34, zoom: 16}, isFavorite: false, isPremium: true, rating: 4.6,
  description: 'A bright apartment near the canal.', bedrooms: 2, goods: ['Wi-Fi', 'Kitchen'],
  host: {name: 'Host', avatarUrl: '/img/avatar-angelina.jpg', isPro: true}, images: ['/img/apartment-01.jpg'], maxAdults: 3,
};
export const review: Review = {id: 'review-1', date: '2026-10-01T12:00:00Z', user: {name: 'Guest', avatarUrl: '/img/avatar-max.jpg', isPro: false}, comment: 'A quiet and comfortable place, very close to the centre.', rating: 4};
export const user: User = {name: 'Test', email: 'test@example.com', avatarUrl: '/img/avatar-max.jpg', isPro: false};
