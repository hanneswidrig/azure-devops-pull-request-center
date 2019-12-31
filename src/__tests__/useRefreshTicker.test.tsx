import * as React from 'react';
import createMockStore from 'redux-mock-store';
import '@testing-library/jest-dom/extend-expect';
import { renderHook } from '@testing-library/react-hooks';

import { initialState } from '../state/store';
import { TestingWrapper } from '../components/TestingWrapper';
import { useRefreshTicker } from '../hooks/useRefreshTicker';

jest.mock('../state/actions', () => ({
  setPullRequests: jest.fn(),
}));

const mockStore = createMockStore([]);

describe('useRefreshTicker', () => {
  it('correct initial ticker value: [off]', () => {
    const { result } = renderHook(() => useRefreshTicker('off'), {
      wrapper: ({ children }: { children?: React.ReactNode }) => (
        <TestingWrapper store={mockStore(initialState)}>{children}</TestingWrapper>
      ),
    });
    expect(result.current.timeUntil).toBe('');
  });
});
