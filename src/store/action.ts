import {User} from '../types/user';
import {createAction} from '@reduxjs/toolkit';
import {Offer} from '../types/offer';

export const changeCity = createAction<string>('offers/changeCity');
export const fillOffers = createAction<Offer[]>('offers/fillOffers');

export const setUser = createAction<User | null>('user/set');
