import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, cleanup } from '@testing-library/react';
import { PRTableCellTitle } from '../components/PRTableCellTitle';
import { PR } from '../state/types';

afterEach(cleanup);

const tableItem = (isDraft = false, isAutoComplete = false) =>
  ({
    title: 'Pull Request Title',
    href: 'https://example.com/pr',
    secondaryTitle: 'Pull Request Secondary Details',
    creationDate: new Date(2019, 1, 1),
    isDraft: isDraft,
    isAutoComplete: isAutoComplete,
    createdBy: {
      displayName: 'Full Name',
      _links: {
        avatar: {
          href: 'https://example.com/avatar',
        },
      },
    },
    repository: {
      name: 'Repository',
    },
    sourceBranch: {
      name: 'refs/heads/Source Branch',
    },
    targetBranch: {
      name: 'refs/heads/Target Branch',
    },
  } as PR);

describe('<PRTableCellTitle />', () => {
  test('should render with correct text for title', () => {
    const { getByText, queryByText } = render(<PRTableCellTitle tableItem={tableItem()} />);
    expect(getByText('Pull Request Title')).toBeTruthy();
    expect(getByText('Pull Request Secondary Details')).toBeTruthy();
    expect(queryByText('Draft')).toBeNull();
    expect(queryByText('Auto Complete')).toBeNull();
  });

  test('should display isDraft and/or isAutoComplete tag', () => {
    const { queryByText } = render(<PRTableCellTitle tableItem={tableItem(true, true)} />);
    expect(queryByText('Draft')).toBeTruthy();
    expect(queryByText('Auto Complete')).toBeTruthy();
  });
});
