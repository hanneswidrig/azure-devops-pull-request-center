import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, cleanup } from '@testing-library/react';

import { IdentityRefWithVote } from 'azure-devops-extension-api/Git/Git';
import { PRTableCellReviewers } from '../components/PRTableCellReviewers';

afterEach(cleanup);

describe('<PRTableCellReviewers />', () => {
  const reviewers: IdentityRefWithVote[] = [];

  test('renders successfully column without any reviewers', () => {
    const { container } = render(<PRTableCellReviewers reviewers={reviewers} />);
    expect(container).toMatchSnapshot();
  });
});
