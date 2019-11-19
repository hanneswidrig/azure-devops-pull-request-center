import '@testing-library/jest-dom/extend-expect';
import { render, cleanup } from '@testing-library/react';
import { getReviewerVoteIconStatus } from '../components/StatusIcon';

afterEach(cleanup);

describe('<StatusIcon />', () => {
  test('render <Approved /> SVG', () => {
    const { container } = render(getReviewerVoteIconStatus(10));
    expect(container).toMatchSnapshot();
    expect(container.querySelector('.vote-status')).toHaveClass('approved');
  });
  test('render <ApprovedWithSuggestions /> SVG', () => {
    const { container } = render(getReviewerVoteIconStatus(5));
    expect(container).toMatchSnapshot();
    expect(container.querySelector('.vote-status')).toHaveClass('approved-with-suggestions');
  });
  test('render <NoVote /> SVG', () => {
    const { container } = render(getReviewerVoteIconStatus(0));
    expect(container).toMatchSnapshot();
    expect(container.querySelector('.vote-status')).toHaveClass('no-vote');
  });
  test('render <WaitingOnAuthor /> SVG', () => {
    const { container } = render(getReviewerVoteIconStatus(-5));
    expect(container).toMatchSnapshot();
    expect(container.querySelector('.vote-status')).toHaveClass('waiting');
  });
  test('render <Rejected /> SVG', () => {
    const { container } = render(getReviewerVoteIconStatus(-10));
    expect(container).toMatchSnapshot();
    expect(container.querySelector('.vote-status')).toHaveClass('rejected');
  });
});
