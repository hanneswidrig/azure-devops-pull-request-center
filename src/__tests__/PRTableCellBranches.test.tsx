import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, cleanup } from '@testing-library/react';
import { PRTableCellBranches } from '../components/PRTableCellBranches';
import { PR } from '../state/types';

afterEach(cleanup);

describe('<PRTableCellBranches />', () => {
  test('render with correct text for each button', () => {
    const props = {
      repository: {
        name: 'Repository',
      },
      sourceBranch: {
        name: 'refs/heads/Source Branch',
      },
      targetBranch: {
        name: 'refs/heads/Target Branch',
      },
    } as PR;
    const { container, getByText } = render(<PRTableCellBranches tableItem={props} />);
    expect(container).toMatchSnapshot();
    expect(getByText('Repository')).toBeTruthy();
    expect(getByText('Source Branch', { exact: true })).toBeTruthy();
    expect(getByText('Target Branch', { exact: true })).toBeTruthy();
  });
});
