import {memo} from 'react';
import {Link} from 'react-router-dom';
import {Offer} from '../../types/offer';

type Props = {offer: Offer; variant?: 'cities' | 'near-places' | 'favorites'; onActive?: (id: string | null) => void};

const PlaceCard = memo(({offer, variant = 'cities', onActive}: Props): JSX.Element => (
  <article className={`${variant}__card place-card`} onMouseEnter={() => onActive?.(offer.id)} onMouseLeave={() => onActive?.(null)}>
    {offer.isPremium && <div className="place-card__mark"><span>Premium</span></div>}
    <div className={`${variant}__image-wrapper place-card__image-wrapper`}><Link to={`/offer/${offer.id}`}><img className="place-card__image" src={offer.previewImage} width={variant === 'favorites' ? 150 : 260} height={variant === 'favorites' ? 110 : 200} alt={offer.title} /></Link></div>
    <div className={`place-card__info ${variant === 'favorites' ? 'favorites__card-info' : ''}`}>
      <div className="place-card__price-wrapper"><div className="place-card__price"><b className="place-card__price-value">€{offer.price}</b><span className="place-card__price-text">/ night</span></div><button className={`place-card__bookmark-button button ${offer.isFavorite ? 'place-card__bookmark-button--active' : ''}`} type="button"><svg className="place-card__bookmark-icon" width="18" height="19"><use xlinkHref="#icon-bookmark" /></svg><span className="visually-hidden">{offer.isFavorite ? 'In bookmarks' : 'To bookmarks'}</span></button></div>
      <div className="place-card__rating rating"><div className="place-card__stars rating__stars"><span style={{width: `${Math.round(offer.rating) * 20}%`}} /><span className="visually-hidden">Rating</span></div></div>
      <h2 className="place-card__name"><Link to={`/offer/${offer.id}`}>{offer.title}</Link></h2><p className="place-card__type">{offer.type.charAt(0).toUpperCase() + offer.type.slice(1)}</p>
    </div>
  </article>
));
PlaceCard.displayName = 'PlaceCard';
export default PlaceCard;
