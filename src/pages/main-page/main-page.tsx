import EmptyOffers from '../../components/empty-offers/empty-offers';
import {selectCityOffers} from '../../store/selectors';
import Spinner from '../../components/spinner/spinner';
import {fetchOffers} from '../../store/api-actions';
import {useCallback, useMemo, useState} from 'react';
import SortOptions from '../../components/sort-options/sort-options';
import {sortOffers} from '../../utils';
import Header from '../../components/header/header';
import OfferList from '../../components/offer-list/offer-list';
import Map from '../../components/map/map';
import CityList from '../../components/city-list/city-list';
import {cities} from '../../const';
import {useAppDispatch, useAppSelector} from '../../hooks';
import {changeCity} from '../../store/action';

export default function MainPage(): JSX.Element {
  const [sort, setSort] = useState('Popular');
  const [activeId, setActiveId] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.offersData.isLoading);
  const error = useAppSelector((state) => state.offersData.error);
  const cityName = useAppSelector((state) => state.cityProcess);
  const offers = useAppSelector(selectCityOffers);
  const sortedOffers = useMemo(() => sortOffers(offers, sort), [offers, sort]);
  const handleCityChange = useCallback((name: string) => {
    dispatch(changeCity(name));
  }, [dispatch]);
  const city = cities.find((item) => item.name === cityName) ?? cities[0];
  if (isLoading) {
    return <><Header /><Spinner /></>;
  }
  if (error) {
    return (
      <>
        <Header />
        <main className="container">
          <p role="alert">{error}</p>
          <button type="button" onClick={() => {
            void dispatch(fetchOffers());
          }}
          >Try again
          </button>
        </main>
      </>
    );
  }
  return (
    <div className="page page--gray page--main"><Header />
      <main className={`page__main page__main--index ${offers.length === 0 ? 'page__main--index-empty' : ''}`}><h1 className="visually-hidden">Cities</h1>
        <CityList cities={cities} selectedCity={cityName} onChange={handleCityChange} />
        <div className="cities">
          <div className={`cities__places-container container ${offers.length === 0 ? 'cities__places-container--empty' : ''}`}>
            {offers.length ? <section className="cities__places places"><h2 className="visually-hidden">Places</h2><b className="places__found">{offers.length} places to stay in {cityName}</b><SortOptions value={sort} onChange={setSort} /><OfferList offers={sortedOffers} onActive={setActiveId} /></section> : <EmptyOffers city={cityName} />}
            <div className="cities__right-section">{offers.length > 0 && <Map city={city} offers={offers} activeId={activeId} />}</div>
          </div>
        </div>
      </main>
    </div>
  );
}
