import {postReview} from '../../store/api-actions';
import {useAppDispatch, useAppSelector} from '../../hooks';
import {useEffect, useState} from 'react';
import {isAxiosError} from 'axios';
import {api} from '../../store';
import {Offer} from '../../types/offer';
import Spinner from '../../components/spinner/spinner';
import {Review} from '../../types/review';
import ReviewList from '../../components/review-list/review-list';
import OfferList from '../../components/offer-list/offer-list';
import Map from '../../components/map/map';
import {useParams} from 'react-router-dom';
import {OfferDetails} from '../../types/offer';
import Header from '../../components/header/header';
import ReviewForm from '../../components/review-form/review-form';
import NotFoundPage from '../not-found-page/not-found-page';

export default function OfferPage(): JSX.Element {
  const dispatch = useAppDispatch();
  const isAuthorized = useAppSelector((state) => state.userProcess.authorizationStatus === 'Auth');
  const {id} = useParams();
  const [offer, setOffer] = useState<OfferDetails | null>(null);
  const [nearby, setNearby] = useState<Offer[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [status, setStatus] = useState('loading');
  useEffect(() => {
    const controller = new AbortController();
    setStatus('loading');
    const load = async () => {
      try {
        const [details, neighbors, comments] = await Promise.all([
          api.get<OfferDetails>(`/offers/${id ?? ''}`, {signal: controller.signal}),
          api.get<Offer[]>(`/offers/${id ?? ''}/nearby`, {signal: controller.signal}),
          api.get<Review[]>(`/comments/${id ?? ''}`, {signal: controller.signal}),
        ]);
        if (controller.signal.aborted) {
          return;
        }
        setOffer(details.data); setNearby(neighbors.data.slice(0, 3)); setReviews(comments.data); setStatus('ready');
      } catch (error) {
        if (!controller.signal.aborted) {
          setStatus(isAxiosError(error) && error.response?.status === 404 ? 'missing' : 'error');
        }
      }
    };
    void load();
    return () => controller.abort();
  }, [id]);
  if (status === 'loading') {
    return <><Header /><Spinner /></>;
  }
  if (status === 'missing') {
    return <NotFoundPage />;
  }
  if (status === 'error' || !offer) {
    return <><Header /><main className="container"><p role="alert">Could not load this offer. Please reload the page.</p></main></>;
  }
  const handleReviewSubmit = async (data: {comment: string; rating: number}) => {
    const review = await dispatch(postReview({offerId: offer.id, ...data})).unwrap();
    setReviews((current) => [review, ...current]);
  };
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
              {offer.isPremium && <div className="offer__mark"><span>Premium</span></div>}
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
                <span className="offer__rating-value rating__value">{offer.rating}</span>
              </div>
              <ul className="offer__features">
                <li className="offer__feature offer__feature--entire">
                  {offer.type.charAt(0).toUpperCase() + offer.type.slice(1)}
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
                  <div className={`offer__avatar-wrapper user__avatar-wrapper ${offer.host.isPro ? 'offer__avatar-wrapper--pro' : ''}`}>
                    <img className="offer__avatar user__avatar" src={offer.host.avatarUrl} width="74" height="74" alt="Host avatar" />
                  </div>
                  <span className="offer__user-name">
                    {offer.host.name}
                  </span>
                  {offer.host.isPro && <span className="offer__user-status">Pro</span>}
                </div>
                <div className="offer__description"><p className="offer__text">{offer.description}</p></div>
              </div>
              <section className="offer__reviews reviews">
                <ReviewList reviews={reviews} />
                {isAuthorized && <ReviewForm key={offer.id} onSubmit={handleReviewSubmit} />}
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
