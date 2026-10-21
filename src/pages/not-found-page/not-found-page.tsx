import {Link} from 'react-router-dom';

export default function NotFoundPage(): JSX.Element {
  return <main className="container"><h1>404 Not Found</h1><Link to="/">Back to home</Link></main>;
}
