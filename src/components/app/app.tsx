import MainPage from '../../pages/main-page/main-page';

export default function App({offersCount}: {offersCount: number}): JSX.Element {
  return <MainPage offersCount={offersCount} />;
}
