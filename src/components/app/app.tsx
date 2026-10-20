import {useAppSelector} from '../../hooks';
import MainPage from '../../pages/main-page/main-page';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import LoginPage from '../../pages/login-page/login-page';
import FavoritesPage from '../../pages/favorites-page/favorites-page';
import OfferPage from '../../pages/offer-page/offer-page';
import NotFoundPage from '../../pages/not-found-page/not-found-page';
import PrivateRoute from '../private-route/private-route';

export default function App(): JSX.Element {
  const offers = useAppSelector((state) => state.offers);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/favorites" element={<PrivateRoute><FavoritesPage offers={offers} /></PrivateRoute>} />
        <Route path="/offer/:id" element={<OfferPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
