import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, cleanup } from '@testing-library/react';

import { SettingsPanel } from '../components/SettingsPanel';

afterEach(cleanup);

describe('<SettingsPanel />', () => {
  test('renders successfully', () => {
    const { container, debug } = render(<SettingsPanel />);
    expect(container).toMatchSnapshot();
    console.log(debug);
  });
});
