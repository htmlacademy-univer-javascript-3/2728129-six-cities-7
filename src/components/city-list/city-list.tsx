import {City} from '../../types/offer';

type Props = {cities: City[]; selectedCity: string; onChange: (city: string) => void};

export default function CityList({cities, selectedCity, onChange}: Props): JSX.Element {
  return (
    <div className="tabs">
      <section className="locations container">
        <ul className="locations__list tabs__list">
          {cities.map((city) => (
            <li className="locations__item" key={city.name}>
              <a
                className={`locations__item-link tabs__item ${selectedCity === city.name ? 'tabs__item--active' : ''}`}
                href="#"
                onClick={(event) => {
                  event.preventDefault(); onChange(city.name);
                }}
                aria-current={selectedCity === city.name ? 'page' : undefined}
              >
                <span>{city.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
