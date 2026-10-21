export default function Spinner(): JSX.Element {
  return <div className="container" role="status" aria-live="polite"><p>Loading…</p><progress aria-label="Loading offers" /></div>;
}
