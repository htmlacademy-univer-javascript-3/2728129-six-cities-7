import {useState} from 'react';

const options = ['Popular', 'Price: low to high', 'Price: high to low', 'Top rated first'];

export default function SortOptions({value, onChange}: {value: string; onChange: (value: string) => void}): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const handleSelect = (option: string) => {
    onChange(option); setIsOpen(false);
  };
  return (
    <form className="places__sorting" onSubmit={(event) => event.preventDefault()}>
      <span className="places__sorting-caption">Sort by </span>
      <button type="button" className="places__sorting-type" aria-expanded={isOpen} aria-label="Sort offers" onClick={() => setIsOpen(!isOpen)}>
        {value}
        <svg className="places__sorting-arrow" width="7" height="4"><use xlinkHref="#icon-arrow-select" /></svg>
      </button>
      {isOpen && (
        <ul className="places__options places__options--custom places__options--opened">
          {options.map((option) => (
            <li key={option} className={`places__option ${option === value ? 'places__option--active' : ''}`}>
              <button type="button" onClick={() => handleSelect(option)}>{option}</button>
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}
