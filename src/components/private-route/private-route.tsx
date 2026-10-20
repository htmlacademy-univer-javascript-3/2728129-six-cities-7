import {Navigate} from 'react-router-dom';

export default function PrivateRoute({isAuthorized, children}: {isAuthorized: boolean; children: JSX.Element}): JSX.Element {
  return isAuthorized ? children : <Navigate to="/login" replace />;
}
