export type Location = {latitude: number; longitude: number; zoom: number};
export type City = {name: string; location: Location};
export type Offer = {
  id: string;
  title: string;
  type: string;
  price: number;
  previewImage: string;
  city: City;
  location: Location;
  isFavorite: boolean;
  isPremium: boolean;
  rating: number;
};
export type OfferDetails = Offer & {
  description: string;
  bedrooms: number;
  goods: string[];
  host: {name: string; avatarUrl: string; isPro: boolean};
  images: string[];
  maxAdults: number;
};
