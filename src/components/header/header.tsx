import {useState} from 'react';
import {Link} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from '../../hooks';
import {logout} from '../../store/api-actions';
export default function Header(): JSX.Element {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const offers = useAppSelector((state) => state.offers);
  const error = useAppSelector((state) => state.authError);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const handleSignOut = async () => {
    setIsSigningOut(true); await dispatch(logout()); setIsSigningOut(false);
  };
  return (
    <header className="header">
      <div className="container">
        <div className="header__wrapper">
          <div className="header__left"><Link className="header__logo-link" to="/"><img className="header__logo" src="/img/logo.svg" alt="6 cities logo" width="81" height="41" /></Link></div>
          <nav className="header__nav">
            <ul className="header__nav-list">
              <li className="header__nav-item user">
                <Link className="header__nav-link header__nav-link--profile" to={user ? '/favorites' : '/login'}>
                  <div className="header__avatar-wrapper user__avatar-wrapper" style={user ? {backgroundImage: `url(${user.avatarUrl})`} : undefined} />
                  {user ? <><span className="header__user-name user__name">{user.email}</span><span className="header__favorite-count">{offers.filter((offer) => offer.isFavorite).length}</span></> : <span className="header__login">Sign in</span>}
                </Link>
              </li>
              {user && (
                <li className="header__nav-item">
                  <button className="header__nav-link" type="button" disabled={isSigningOut} onClick={() => {
                    void handleSignOut();
                  }}
                  >
                    <span className="header__signout">Sign out</span>
                  </button>
                  {error && <p role="alert">{error}</p>}
                </li>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
