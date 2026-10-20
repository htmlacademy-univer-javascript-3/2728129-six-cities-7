import {Review} from '../../types/review';
import ReviewList from '../../components/review-list/review-list';
import OfferList from '../../components/offer-list/offer-list';
import Map from '../../components/map/map';
import {useParams} from 'react-router-dom';
import {OfferDetails} from '../../types/offer';
import Header from '../../components/header/header';
import ReviewForm from '../../components/review-form/review-form';
import NotFoundPage from '../not-found-page/not-found-page';

export default function OfferPage({offers, reviews}: {offers: OfferDetails[]; reviews: Review[]}): JSX.Element {
  const {id} = useParams();
  const offer = offers.find((item) => item.id === id);
  if (!offer) {
    return <NotFoundPage />;
  }

  const nearby = offers.filter((item) => item.id !== offer.id).slice(0, 3);
  return (
    <div className="page">
      <Header />

      <main className="page__main page__main--offer">
        <section className="offer">
          <div className="offer__gallery-container container">
            <div className="offer__gallery">{offer.images.slice(0, 6).map((image) => <div className="offer__image-wrapper" key={image}><img className="offer__image" src={image} alt={offer.title} /></div>)}</div>
          </div>
          <div className="offer__container container">
            <div className="offer__wrapper">
              <div className="offer__mark">
                <span>Premium</span>
              </div>
              <div className="offer__name-wrapper">
                <h1 className="offer__name">
                  {offer.title}
                </h1>
                <button className="offer__bookmark-button button" type="button">
                  <svg className="offer__bookmark-icon" width="31" height="33">
                    <use xlinkHref="#icon-bookmark"></use>
                  </svg>
                  <span className="visually-hidden">To bookmarks</span>
                </button>
              </div>
              <div className="offer__rating rating">
                <div className="offer__stars rating__stars">
                  <span style={{width: `${Math.round(offer.rating) * 20}%`}}></span>
                  <span className="visually-hidden">Rating</span>
                </div>
                <span className="offer__rating-value rating__value">4.8</span>
              </div>
              <ul className="offer__features">
                <li className="offer__feature offer__feature--entire">
                  Apartment
                </li>
                <li className="offer__feature offer__feature--bedrooms">
                  {offer.bedrooms} {offer.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}
                </li>
                <li className="offer__feature offer__feature--adults">
                  Max {offer.maxAdults} {offer.maxAdults === 1 ? 'adult' : 'adults'}
                </li>
              </ul>
              <div className="offer__price">
                <b className="offer__price-value">€{offer.price}</b>
                <span className="offer__price-text">&nbsp;night</span>
              </div>
              <div className="offer__inside"><h2 className="offer__inside-title">What&apos;s inside</h2><ul className="offer__inside-list">{offer.goods.map((good) => <li className="offer__inside-item" key={good}>{good}</li>)}</ul></div>
              <div className="offer__host">
                <h2 className="offer__host-title">Meet the host</h2>
                <div className="offer__host-user user">
                  <div className="offer__avatar-wrapper offer__avatar-wrapper--pro user__avatar-wrapper">
                    <img className="offer__avatar user__avatar" src={offer.host.avatarUrl} width="74" height="74" alt="Host avatar" />
                  </div>
                  <span className="offer__user-name">
                    {offer.host.name}
                  </span>
                  <span className="offer__user-status">
                    Pro
                  </span>
                </div>
                <div className="offer__description"><p className="offer__text">{offer.description}</p></div>
              </div>
              <section className="offer__reviews reviews">
                <ReviewList reviews={reviews} />
                <ReviewForm />
              </section>
            </div>
          </div>
          <Map city={offer.city} offers={[offer, ...nearby]} activeId={offer.id} className="offer__map" />
        </section>
        <div className="container">
          <section className="near-places places">
            <h2 className="near-places__title">Other places in the neighbourhood</h2>
            <OfferList offers={nearby} variant="near-places" />
          </section>
        </div>
      </main>
    </div>
  );
}
