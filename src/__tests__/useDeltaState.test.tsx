import * as React from 'react';
import createMockStore from 'redux-mock-store';
import '@testing-library/jest-dom/extend-expect';
import { renderHook } from '@testing-library/react-hooks';

import { initialState } from '../state/store';
import { useDeltaState, defaultDeltaState } from '../hooks/useDeltaState';
import { TestingWrapper, WrapperType } from '../components/TestingWrapper';

const mockStore = createMockStore([]);

describe('useDeltaState', () => {
  it('initalizes successfully', () => {
    const { result } = renderHook(() => useDeltaState(), {
      wrapper: ({ children }: WrapperType) => (
        <TestingWrapper store={mockStore(initialState)}>{children}</TestingWrapper>
      ),
    });
    expect(result.current.deltaUpdate).toEqual(defaultDeltaState);
  });
});
