import {changeCity} from '../../store/action';
import {useEffect} from 'react';
import {Link} from 'react-router-dom';
import Header from '../../components/header/header';
import OfferList from '../../components/offer-list/offer-list';
import Spinner from '../../components/spinner/spinner';
import {useAppDispatch, useAppSelector} from '../../hooks';
import {fetchFavorites} from '../../store/api-actions';

export default function FavoritesPage(): JSX.Element {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.offersData.favorites);
  const status = useAppSelector((state) => state.offersData.favoritesStatus);
  useEffect(() => {
    if (status === 'idle') {
      void dispatch(fetchFavorites());
    }
  }, [dispatch, status]);
  const cities = [...new Set(favorites.map((offer) => offer.city.name))];
  const isEmpty = favorites.length === 0;
  const handleRetry = () => {
    void dispatch(fetchFavorites());
  };
  let content: JSX.Element;
  if (status === 'loading' || status === 'idle') {
    content = <Spinner />;
  } else if (status === 'error') {
    content = <section className="favorites"><p role="alert">Could not load bookmarks.</p><button type="button" onClick={handleRetry}>Try again</button></section>;
  } else {
    content = (
      <section className={`favorites ${isEmpty ? 'favorites--empty' : ''}`}>
        <h1 className={isEmpty ? 'visually-hidden' : 'favorites__title'}>Saved listing</h1>
        {isEmpty ? (
          <div className="favorites__status-wrapper">
            <b className="favorites__status">Nothing yet saved</b>
            <p className="favorites__status-description">Save properties to narrow down search or plan your future trips.</p>
          </div>
        ) : (
          <ul className="favorites__list">
            {cities.map((city) => (
              <li key={city} className="favorites__locations-items">
                <div className="favorites__locations locations locations--current"><div className="locations__item"><Link className="locations__item-link" to="/" onClick={() => dispatch(changeCity(city))}><span>{city}</span></Link></div></div>
                <OfferList offers={favorites.filter((offer) => offer.city.name === city)} variant="favorites" />
              </li>
            ))}
          </ul>
        )}
      </section>
    );
  }
  return (
    <div className={`page ${isEmpty ? 'page--favorites-empty' : ''}`}>
      <Header />
      <main className={`page__main page__main--favorites ${isEmpty ? 'page__main--favorites-empty' : ''}`}>
        <div className="page__favorites-container container">{content}</div>
      </main>
      <footer className="footer container"><Link className="footer__logo-link" to="/"><img className="footer__logo" src="/img/logo.svg" alt="6 cities logo" width="64" height="33" /></Link></footer>
    </div>
  );
}
