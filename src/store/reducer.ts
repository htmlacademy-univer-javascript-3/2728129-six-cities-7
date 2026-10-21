import {combineReducers} from '@reduxjs/toolkit';
import {offersData} from './offers-data';
import {userProcess} from './user-process';
import {cityProcess} from './city-process';
export const reducer = combineReducers({offersData, userProcess, cityProcess});
