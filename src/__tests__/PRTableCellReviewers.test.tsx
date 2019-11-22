import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, cleanup } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';

import { IdentityRefWithVote } from 'azure-devops-extension-api/Git/Git';
import { PRTableCellReviewers, CalculatePillWidth, Reviewer } from '../components/PRTableCellReviewers';

afterEach(cleanup);

describe('<PRTableCellReviewers />', () => {
  const reviewers: IdentityRefWithVote[] = [];

  test('renders successfully column without any reviewers', () => {
    const { container } = render(<PRTableCellReviewers reviewers={reviewers} />);
    expect(container).toMatchSnapshot();
  });

  test('render CalculatePillWidth correctly', () => {
    const reviewer = {
      displayName: 'PR Reviewer #1',
      _links: {
        avatar: 'https://image.com',
      },
      vote: 0,
    } as IdentityRefWithVote;
    const index = 0;
    const { result } = renderHook(() => {
      const [pills, setPills] = React.useState<Reviewer[]>([]);
      return { pills, setPills };
    });

    const {} = render(<CalculatePillWidth reviewer={reviewer} index={index} setPills={result.current.setPills} />);

    expect(result.current.pills.length).toBe(0);
  });
});
