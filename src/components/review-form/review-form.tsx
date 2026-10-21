import {FormEvent, Fragment, useState} from 'react';

type Props = {onSubmit: (data: {comment: string; rating: number}) => Promise<void>};

export default function ReviewForm({onSubmit}: Props): JSX.Element {
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isValid = rating > 0 && comment.trim().length >= 50 && comment.length <= 300;
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid || isSubmitting) {
      return;
    }
    setIsSubmitting(true); setError(null);
    try {
      await onSubmit({comment: comment.trim(), rating});
      setComment(''); setRating(0);
    } catch {
      setError('Could not send your review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <form className="reviews__form form" onSubmit={(event) => {
      void handleSubmit(event);
    }}
    >
      <label className="reviews__label form__label" htmlFor="review">Your review</label>
      <div className="reviews__rating-form form__rating">
        {[5, 4, 3, 2, 1].map((value) => (
          <Fragment key={value}>
            <input className="form__rating-input visually-hidden" name="rating" value={value} id={`star-${value}`} type="radio" checked={rating === value} onChange={() => setRating(value)} disabled={isSubmitting} />
            <label htmlFor={`star-${value}`} className="reviews__rating-label form__rating-label" title={`${value} stars`} aria-label={`${value} stars`}><svg className="form__star-image" width="37" height="33"><use xlinkHref="#icon-star" /></svg></label>
          </Fragment>
        ))}
      </div>
      <textarea className="reviews__textarea form__textarea" id="review" name="review" placeholder="Tell how was your stay, what you like and what can be improved" value={comment} onChange={(event) => setComment(event.target.value)} minLength={50} maxLength={300} disabled={isSubmitting} />
      {error && <p role="alert">{error}</p>}
      <div className="reviews__button-wrapper">
        <p className="reviews__help">To submit review please make sure to set <span className="reviews__star">rating</span> and describe your stay with at least <b className="reviews__text-amount">50 characters</b>.</p>
        <button className="reviews__submit form__submit button" type="submit" disabled={!isValid || isSubmitting}>{isSubmitting ? 'Sending…' : 'Submit'}</button>
      </div>
    </form>
  );
}
