import {Review} from '../../types/review';
import ReviewItem from '../review-item/review-item';
export default function ReviewList({reviews}: {reviews: Review[]}): JSX.Element {
  const sortedReviews = [...reviews].sort((a, b) => Date.parse(b.date) - Date.parse(a.date)).slice(0, 10);
  return <><h2 className="reviews__title">Reviews · <span className="reviews__amount">{reviews.length}</span></h2><ul className="reviews__list">{sortedReviews.map((review) => <ReviewItem key={review.id} review={review} />)}</ul></>;
}
