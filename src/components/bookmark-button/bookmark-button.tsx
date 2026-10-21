import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from '../../hooks';
import {toggleFavorite} from '../../store/api-actions';

type Props = {offer: {id: string; isFavorite: boolean}; variant?: 'place-card' | 'offer'};
export default function BookmarkButton({offer, variant = 'place-card'}: Props): JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthorized = useAppSelector((state) => state.userProcess.authorizationStatus === 'Auth');
  const currentOffer = useAppSelector((state) => state.offersData.offers.find((item) => item.id === offer.id));
  const favorites = useAppSelector((state) => state.offersData.favorites);
  const favoritesStatus = useAppSelector((state) => state.offersData.favoritesStatus);
  const isFavorite = favoritesStatus === 'ready' ? favorites.some((item) => item.id === offer.id) : (currentOffer?.isFavorite ?? offer.isFavorite);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(false);
  const handleClick = async () => {
    if (!isAuthorized) {
      navigate('/login'); return;
    }
    if (isSaving) {
      return;
    }
    setIsSaving(true); setError(false);
    try {
      await dispatch(toggleFavorite({id: offer.id, isFavorite})).unwrap();
    } catch {
      setError(true);
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <>
      <button className={`${variant}__bookmark-button button ${isFavorite ? `${variant}__bookmark-button--active` : ''}`} type="button" aria-pressed={isFavorite} disabled={isSaving} onClick={() => {
        void handleClick();
      }}
      >
        <svg className={`${variant}__bookmark-icon`} width={variant === 'offer' ? 31 : 18} height={variant === 'offer' ? 33 : 19}><use xlinkHref="#icon-bookmark" /></svg>
        <span className="visually-hidden">{isFavorite ? 'In bookmarks' : 'To bookmarks'}</span>
      </button>
      {error && <p role="alert">Could not update bookmarks. Try again.</p>}
    </>
  );
}
