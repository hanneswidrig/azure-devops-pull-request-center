import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, cleanup } from '@testing-library/react';

import { Colors } from '../lib/colors';
import { Tag } from '../components/Tag';

afterEach(cleanup);

describe('<Tag />', () => {
  test('should display autoComplete', () => {
    const { container, getByText } = render(<Tag title={'Auto Complete'} type={'autoComplete'} />);
    expect(container).toMatchSnapshot();
    expect(getByText('Auto Complete')).toBeTruthy();
    expect(container.querySelector('.tag-container')).toHaveStyle(`color: ${Colors.orange.primary}`);
  });

  test('should display draft', () => {
    const { container, getByText } = render(<Tag title={'Draft'} type={'draft'} />);
    expect(container).toMatchSnapshot();
    expect(getByText('Draft')).toBeTruthy();
    expect(container.querySelector('.tag-container')).toHaveStyle(`color: ${Colors.blue.primary}`);
  });

  test('should display mergeConflict', () => {
    const { container, getByText } = render(<Tag title={'Merge Conflict'} type={'mergeConflict'} />);
    expect(container).toMatchSnapshot();
    expect(getByText('Merge Conflict')).toBeTruthy();
    expect(container.querySelector('.tag-container')).toHaveStyle(`color: ${Colors.red.primary}`);
  });
});
