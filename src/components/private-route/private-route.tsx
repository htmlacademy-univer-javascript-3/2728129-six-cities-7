import {Navigate} from 'react-router-dom';
import {useAppSelector} from '../../hooks';
import Spinner from '../spinner/spinner';
export default function PrivateRoute({children}: {children: JSX.Element}): JSX.Element {
  const status = useAppSelector((state) => state.userProcess.authorizationStatus);
  if (status === 'Unknown') {
    return <Spinner />;
  }
  return status === 'Auth' ? children : <Navigate to="/login" replace />;
}
