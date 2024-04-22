import React from 'react';
import createMockStore from 'redux-mock-store';
import '@testing-library/jest-dom/extend-expect';
import { renderHook, act } from '@testing-library/react-hooks';

import { initialState } from '../state/initialState';
import { useRefreshTicker } from '../hooks/useRefreshTicker';
import { TestingWrapper, WrapperType } from '../components/TestingWrapper';

jest.mock('../state/store', () => ({
  asyncActions: {
    getPullRequests: () => ({ type: 'root/getPullRequests' }),
    getCompletedPullRequests: () => ({ type: 'root/getCompletedPullRequests' }),
  },
}));

const store = createMockStore([])(initialState);

describe('useRefreshTicker', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  it('initial ticker value: [off]', () => {
    const { result } = renderHook(() => useRefreshTicker('off'), {
      wrapper: ({ children }: WrapperType) => <TestingWrapper store={store}>{children}</TestingWrapper>,
    });
    expect(result.current.timeUntil).toBe('');
  });

  it('initial ticker value: [60]', () => {
    const { result } = renderHook(() => useRefreshTicker('60'), {
      wrapper: ({ children }: WrapperType) => <TestingWrapper store={store}>{children}</TestingWrapper>,
    });
    expect(result.current.timeUntil).toBe('1:00');
  });

  it('initial ticker value: [300]', () => {
    const { result } = renderHook(() => useRefreshTicker('300'), {
      wrapper: ({ children }: WrapperType) => <TestingWrapper store={store}>{children}</TestingWrapper>,
    });
    expect(result.current.timeUntil).toBe('5:00');
  });

  it('initial ticker value: [900]', () => {
    const { result } = renderHook(() => useRefreshTicker('900'), {
      wrapper: ({ children }: WrapperType) => <TestingWrapper store={store}>{children}</TestingWrapper>,
    });
    expect(result.current.timeUntil).toBe('15:00');
  });

  it('initial ticker value: [3600]', () => {
    const { result } = renderHook(() => useRefreshTicker('3600'), {
      wrapper: ({ children }: WrapperType) => <TestingWrapper store={store}>{children}</TestingWrapper>,
    });
    expect(result.current.timeUntil).toBe('60:00');
  });

  it('ticks correctly at: 5:00 -> 4:59', async () => {
    const { result } = renderHook(() => useRefreshTicker('300'), {
      wrapper: ({ children }: WrapperType) => <TestingWrapper store={store}>{children}</TestingWrapper>,
    });
    expect(result.current.timeUntil).toBe('5:00');

    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(result.current.timeUntil).toBe('4:59');
  });

  it('restart ticks: 0:01 -> 5:00', async () => {
    const { result } = renderHook(() => useRefreshTicker('300'), {
      wrapper: ({ children }: WrapperType) => <TestingWrapper store={store}>{children}</TestingWrapper>,
    });
    act(() => {
      jest.advanceTimersByTime(299000);
    });
    expect(result.current.timeUntil).toBe('0:01');

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current.timeUntil).toBe('5:00');
  });
});
