import {FormEvent, useState} from 'react';

export default function ReviewForm(): JSX.Element {
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };
  return <form className="reviews__form form" onSubmit={handleSubmit}><label className="reviews__label form__label" htmlFor="review">Your review</label><div className="reviews__rating-form form__rating">{[5, 4, 3, 2, 1].map((value) => <span key={value} style={{display: 'contents'}}><input className="form__rating-input visually-hidden" name="rating" value={value} id={`star-${value}`} type="radio" checked={rating === value} onChange={() => setRating(value)} /><label htmlFor={`star-${value}`} className="reviews__rating-label form__rating-label" title={`${value} stars`}><svg className="form__star-image" width="37" height="33"><use xlinkHref="#icon-star" /></svg></label></span>)}</div><textarea className="reviews__textarea form__textarea" id="review" name="review" placeholder="Tell how was your stay, what you like and what can be improved" value={comment} onChange={(event) => setComment(event.target.value)} maxLength={300} /><div className="reviews__button-wrapper"><p className="reviews__help">To submit review please make sure to set <span className="reviews__star">rating</span> and describe your stay with at least <b className="reviews__text-amount">50 characters</b>.</p><button className="reviews__submit form__submit button" type="submit" disabled={!rating || comment.trim().length < 50 || comment.length > 300}>Submit</button></div></form>;
}
