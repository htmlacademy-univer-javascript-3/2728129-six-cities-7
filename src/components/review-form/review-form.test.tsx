import {cleanup, fireEvent, render, screen, waitFor} from '@testing-library/react';
import {afterEach, describe, expect, it, vi} from 'vitest';
import ReviewForm from './review-form';

afterEach(cleanup);
const comment = 'A very comfortable apartment close to the centre and public transport.';

describe('Review form', () => {
  it('requires both a rating and at least 50 characters', () => {
    render(<ReviewForm onSubmit={vi.fn()} />);
    const submit = screen.getByRole('button', {name: 'Submit'});
    expect(submit).toBeDisabled();
    fireEvent.change(screen.getByLabelText('Your review'), {target: {value: comment}});
    expect(submit).toBeDisabled();
    fireEvent.click(screen.getByLabelText('5 stars'));
    expect(submit).toBeEnabled();
  });
  it('blocks controls during sending and clears successful input', async () => {
    let finish: () => void = () => undefined;
    const onSubmit = vi.fn(() => new Promise<void>((resolve) => {
      finish = resolve;
    }));
    render(<ReviewForm onSubmit={onSubmit} />);
    const input = screen.getByLabelText('Your review');
    fireEvent.change(input, {target: {value: comment}});
    fireEvent.click(screen.getByLabelText('5 stars'));
    fireEvent.click(screen.getByRole('button', {name: 'Submit'}));
    expect(input).toBeDisabled();
    expect(onSubmit).toHaveBeenCalledWith({comment, rating: 5});
    finish();
    await waitFor(() => expect(input).toHaveValue(''));
    expect(input).toBeEnabled();
    expect(screen.getByRole('button', {name: 'Submit'})).toBeDisabled();
  });
  it('preserves input and allows retry after failure', async () => {
    render(<ReviewForm onSubmit={vi.fn().mockRejectedValue(new Error('offline'))} />);
    const input = screen.getByLabelText('Your review');
    fireEvent.change(input, {target: {value: comment}});
    fireEvent.click(screen.getByLabelText('4 stars'));
    fireEvent.click(screen.getByRole('button', {name: 'Submit'}));
    await screen.findByRole('alert');
    expect(input).toHaveValue(comment);
    expect(screen.getByRole('button', {name: 'Submit'})).toBeEnabled();
  });
});
