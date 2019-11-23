import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, cleanup } from '@testing-library/react';

import { IdentityRefWithVote } from 'azure-devops-extension-api/Git/Git';
import { PRTableCellReviewers } from '../components/PRTableCellReviewers';

afterEach(cleanup);

describe('<PRTableCellReviewers />', () => {
  test('renders successfully without any reviewers', () => {
    const reviewers: IdentityRefWithVote[] = [];
    const { container } = render(<PRTableCellReviewers reviewers={reviewers} />);
    expect(container).toMatchSnapshot();
  });

  test('renders successfully with reviewers', () => {
    const reviewers: IdentityRefWithVote[] = [
      {
        displayName: 'PR Reviewer #1',
        _links: {
          avatar: { href: 'https://image.com/1' },
        },
        vote: 10,
      },
      {
        displayName: 'PR Reviewer #2',
        _links: {
          avatar: { href: 'https://image.com/2' },
        },
        vote: 5,
      },
      {
        displayName: 'PR Reviewer #3',
        _links: {
          avatar: { href: 'https://image.com/3' },
        },
        vote: 0,
      },
      {
        displayName: 'PR Reviewer #4',
        _links: {
          avatar: { href: 'https://image.com/4' },
        },
        vote: -5,
      },
      {
        displayName: 'PR Reviewer #5',
        _links: {
          avatar: { href: 'https://image.com/5' },
        },
        vote: -10,
      },
    ] as IdentityRefWithVote[];
    const { getAllByText, container } = render(<PRTableCellReviewers reviewers={reviewers} />);

    expect(container).toMatchSnapshot();
    expect(getAllByText('PR Reviewer #1')).toBeTruthy();
    expect(getAllByText('PR Reviewer #2')).toBeTruthy();
    expect(getAllByText('PR Reviewer #3')).toBeTruthy();
    expect(getAllByText('PR Reviewer #4')).toBeTruthy();
    expect(getAllByText('PR Reviewer #5')).toBeTruthy();
  });
});
