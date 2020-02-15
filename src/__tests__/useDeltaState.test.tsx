import * as React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import '@testing-library/jest-dom/extend-expect';
import { renderHook, act, cleanup } from '@testing-library/react-hooks';

import { ActionTypes, PR } from '../state/types';
import { initialState } from '../state/initialState';
import { useDeltaState, defaultDeltaState } from '../hooks/useDeltaState';

type WrapperType = { children?: React.ReactNode };
type MockPR = Pick<PR, 'pullRequestId' | 'isActive' | 'isDraft' | 'isCompleted'>;

afterEach(cleanup);

describe('useDeltaState', () => {
  it('initalizes successfully', () => {
    const store = configureStore([])(initialState);
    const { result } = renderHook(() => useDeltaState(), {
      wrapper: ({ children }: WrapperType) => <Provider store={store}>{children}</Provider>,
    });
    expect(result.current.deltaUpdate).toEqual(defaultDeltaState);
  });

  it('accurately delta initial and updated list of pull requests', () => {
    const store = configureStore([])(initialState);
    const { result } = renderHook(() => useDeltaState(), {
      wrapper: ({ children }: WrapperType) => <Provider store={store}>{children}</Provider>,
    });
    const firstBatch: MockPR[] = [
      { pullRequestId: 1, isActive: true, isCompleted: false, isDraft: false },
      { pullRequestId: 2, isActive: true, isCompleted: false, isDraft: false },
      { pullRequestId: 3, isActive: true, isCompleted: false, isDraft: false },
    ];

    const secondBatch: MockPR[] = [
      { pullRequestId: 1, isActive: true, isCompleted: false, isDraft: false },
      { pullRequestId: 2, isActive: true, isCompleted: false, isDraft: false },
      { pullRequestId: 3, isActive: true, isCompleted: false, isDraft: false },
      { pullRequestId: 4, isActive: true, isCompleted: false, isDraft: false },
    ];

    const thirdBatch: MockPR[] = [
      { pullRequestId: 1, isActive: false, isCompleted: true, isDraft: false },
      { pullRequestId: 2, isActive: true, isCompleted: false, isDraft: false },
      { pullRequestId: 3, isActive: true, isCompleted: false, isDraft: false },
      { pullRequestId: 4, isActive: true, isCompleted: false, isDraft: false },
      { pullRequestId: 5, isActive: true, isCompleted: false, isDraft: false },
    ];

    const fourthBatch: MockPR[] = [
      { pullRequestId: 1, isActive: false, isCompleted: true, isDraft: false },
      { pullRequestId: 2, isActive: false, isCompleted: true, isDraft: false },
      { pullRequestId: 3, isActive: false, isCompleted: true, isDraft: false },
      { pullRequestId: 4, isActive: true, isCompleted: false, isDraft: false },
      { pullRequestId: 5, isActive: true, isCompleted: false, isDraft: false },
      { pullRequestId: 6, isActive: true, isCompleted: false, isDraft: true },
    ];

    expect(result.current.deltaUpdate).toEqual(defaultDeltaState);

    act(() => {
      store.dispatch({ type: ActionTypes.ADD_ASYNC_TASK });
      store.dispatch({ type: ActionTypes.SET_PULL_REQUESTS, payload: firstBatch });
      store.dispatch({ type: ActionTypes.REMOVE_ASYNC_TASK });
    });

    act(() => {
      store.dispatch({ type: ActionTypes.SET_PULL_REQUESTS, payload: secondBatch });
    });

    act(() => {
      store.dispatch({ type: ActionTypes.SET_PULL_REQUESTS, payload: thirdBatch });
    });

    act(() => {
      store.dispatch({ type: ActionTypes.SET_PULL_REQUESTS, payload: fourthBatch });
    });
  });
});
