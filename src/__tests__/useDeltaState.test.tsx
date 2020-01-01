import * as React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import '@testing-library/jest-dom/extend-expect';
import { renderHook, act, cleanup } from '@testing-library/react-hooks';

import { reducer } from '../state/store';
import { ActionTypes, PR } from '../state/types';
import { useDeltaState, defaultDeltaState } from '../hooks/useDeltaState';

type WrapperType = { children?: React.ReactNode };
type MockPR = Pick<PR, 'pullRequestId' | 'isActive' | 'isDraft' | 'isCompleted'>;

afterEach(cleanup);

describe('useDeltaState', () => {
  it('initalizes successfully', () => {
    const store = createStore(reducer);
    const { result } = renderHook(() => useDeltaState(), {
      wrapper: ({ children }: WrapperType) => <Provider store={store}>{children}</Provider>,
    });
    expect(result.current.deltaUpdate).toEqual(defaultDeltaState);
  });

  it('accurately delta initial and updated list of pull requests', () => {
    const store = createStore(reducer);
    const { result } = renderHook(() => useDeltaState(), {
      wrapper: ({ children }: WrapperType) => <Provider store={store}>{children}</Provider>,
    });
    const nextPrs: MockPR[] = [
      {
        pullRequestId: 1,
        isActive: true,
        isCompleted: false,
        isDraft: false,
      },
      {
        pullRequestId: 2,
        isActive: true,
        isCompleted: false,
        isDraft: false,
      },
      {
        pullRequestId: 3,
        isActive: true,
        isCompleted: false,
        isDraft: false,
      },
    ];

    expect(result.current.deltaUpdate).toEqual(defaultDeltaState);

    act(() => {
      store.dispatch({ type: ActionTypes.ADD_ASYNC_TASK });
      store.dispatch({ type: ActionTypes.SET_PULL_REQUESTS, payload: nextPrs });
      store.dispatch({ type: ActionTypes.REMOVE_ASYNC_TASK });
    });
  });
});
