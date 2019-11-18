import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, cleanup } from '@testing-library/react';

import { Colors } from '../lib/colors';
import { Tag } from '../components/Tag';

afterEach(cleanup);

describe('<Tag />', () => {
  test('should use autoComplete type', () => {
    const { container } = render(<Tag title={'Title'} type={'autoComplete'} />);
    expect(container).toMatchSnapshot();
    expect(container.querySelector('.tag-container')).toHaveStyle(`color: ${Colors.orange.primary}`);
  });

  test('should use draft type', () => {
    const { container } = render(<Tag title={'Title'} type={'draft'} />);
    expect(container).toMatchSnapshot();
    expect(container.querySelector('.tag-container')).toHaveStyle(`color: ${Colors.blue.primary}`);
  });
});
