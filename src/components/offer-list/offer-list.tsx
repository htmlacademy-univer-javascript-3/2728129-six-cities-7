import {memo, useCallback, useState} from 'react';
import {Offer} from '../../types/offer';
import PlaceCard from '../place-card/place-card';

type Props = {offers: Offer[]; variant?: 'cities' | 'near-places' | 'favorites'; onActive?: (id: string | null) => void};

const OfferList = memo(({offers, variant = 'cities', onActive}: Props): JSX.Element => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const handleActive = useCallback((id: string | null) => {
    setActiveId(id); onActive?.(id);
  }, [onActive]);
  return <div className={`${variant === 'near-places' ? 'near-places__list' : `${variant}__places-list`} places__list ${variant === 'cities' ? 'tabs__content' : ''}`} data-active-offer={activeId}>{offers.map((offer) => <PlaceCard key={offer.id} offer={offer} variant={variant} onActive={handleActive} />)}</div>;
});
OfferList.displayName = 'OfferList';
export default OfferList;
