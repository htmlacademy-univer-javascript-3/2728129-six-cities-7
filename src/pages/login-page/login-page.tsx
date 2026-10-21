import {FormEvent, useState} from 'react';
import {Link, Navigate} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from '../../hooks';
import {login} from '../../store/api-actions';
import {changeCity} from '../../store/action';
import {cities} from '../../const';
import Spinner from '../../components/spinner/spinner';
export default function LoginPage(): JSX.Element {
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.userProcess.authorizationStatus);
  const isSubmitting = useAppSelector((state) => state.userProcess.isLoggingIn);
  const error = useAppSelector((state) => state.userProcess.authError);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [city] = useState(() => cities[Math.floor(Math.random() * cities.length)].name);
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); void dispatch(login({email: email.trim(), password}));
  };
  if (status === 'Unknown') {
    return <Spinner />;
  }
  if (status === 'Auth') {
    return <Navigate to="/" replace />;
  }
  return (
    <div className="page page--gray page--login">
      <header className="header"><div className="container"><div className="header__wrapper"><div className="header__left"><Link className="header__logo-link" to="/"><img className="header__logo" src="/img/logo.svg" alt="6 cities logo" width="81" height="41" /></Link></div></div></div></header>
      <main className="page__main page__main--login">
        <div className="page__login-container container">
          <section className="login"><h1 className="login__title">Sign in</h1>
            <form className="login__form form" onSubmit={handleSubmit}>
              <div className="login__input-wrapper form__input-wrapper"><label className="visually-hidden" htmlFor="email">Email</label><input id="email" className="login__input form__input" type="email" name="email" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} required disabled={isSubmitting} /></div>
              <div className="login__input-wrapper form__input-wrapper"><label className="visually-hidden" htmlFor="password">Password</label><input id="password" className="login__input form__input" type="password" name="password" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} pattern="(?=.*[A-Za-z])(?=.*[0-9]).+" title="Use at least one letter and one digit" required disabled={isSubmitting} /></div>
              {error && <p role="alert">{error}</p>}
              <button className="login__submit form__submit button" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Signing in…' : 'Sign in'}</button>
            </form>
          </section>
          <section className="locations locations--login locations--current"><div className="locations__item"><Link className="locations__item-link" to="/" onClick={() => dispatch(changeCity(city))}><span>{city}</span></Link></div></section>
        </div>
      </main>
    </div>
  );
}
