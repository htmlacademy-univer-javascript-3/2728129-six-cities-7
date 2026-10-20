import {Link} from 'react-router-dom';
import {Offer} from '../../types/offer';
import Header from '../../components/header/header';
import OfferList from '../../components/offer-list/offer-list';

export default function FavoritesPage({offers}: {offers: Offer[]}): JSX.Element {
  const favorites = offers.filter((offer) => offer.isFavorite);
  const cities = [...new Set(favorites.map((offer) => offer.city.name))];
  return <div className="page"><Header /><main className="page__main page__main--favorites"><div className="page__favorites-container container"><section className="favorites"><h1 className="favorites__title">Saved listing</h1>{favorites.length === 0 ? <p>Nothing yet saved</p> : <ul className="favorites__list">{cities.map((city) => <li key={city} className="favorites__locations-items"><div className="favorites__locations locations locations--current"><div className="locations__item"><Link className="locations__item-link" to="/"><span>{city}</span></Link></div></div><OfferList offers={favorites.filter((offer) => offer.city.name === city)} variant="favorites" /></li>)}</ul>}</section></div></main><footer className="footer container"><Link className="footer__logo-link" to="/"><img className="footer__logo" src="/img/logo.svg" alt="6 cities logo" width="64" height="33" /></Link></footer></div>;
}
