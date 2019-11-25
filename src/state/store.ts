import produce from 'immer';
import { Reducer } from 'redux';
import { ObservableValue } from 'azure-devops-ui/Core/Observable';

import { FetchAction } from './actions';
import { ActionTypes, PrHubState } from './types';
import { sortByPullRequestId } from '../lib/utils';
import { Enum, SplitReducer } from '../lib/typings';
import { pullRequestItemProvider$ } from '../tabs/TabProvider';

const initialState: PrHubState = {
  data: {
    repositories: [],
    pullRequests: [],
    currentUser: { id: '', name: '', displayName: '', descriptor: '', imageUrl: '' },
    asyncTaskCount: 0,
  },
  ui: {
    isFilterVisible: new ObservableValue(false),
    isFullScreenMode: false,
    selectedTab: 'active',
    sortDirection: 'desc',
  },
};

const setState: SplitReducer = (state, action) => [
  [
    ActionTypes.SET_CURRENT_USER,
    () => {
      return produce(state, draft => {
        draft.data.currentUser = action.payload;
      });
    },
  ],
  [
    ActionTypes.SET_FULL_SCREEN_MODE,
    () => {
      return produce(state, draft => {
        draft.ui.isFullScreenMode = action.payload;
      });
    },
  ],
  [
    ActionTypes.SET_PULL_REQUESTS,
    () => {
      return produce(state, draft => {
        draft.data.pullRequests = action.payload;
      });
    },
  ],
  [
    ActionTypes.SET_REPOSITORIES,
    () => {
      return produce(state, draft => {
        draft.data.repositories = action.payload;
      });
    },
  ],
  [
    ActionTypes.SET_SELECTED_TAB,
    () => {
      return produce(state, draft => {
        draft.ui.selectedTab = action.payload;
      });
    },
  ],
];

const updateState: SplitReducer = state => [
  [
    ActionTypes.ADD_ASYNC_TASK,
    () => {
      return produce(state, draft => {
        draft.data.asyncTaskCount = state.data.asyncTaskCount + 1;
      });
    },
  ],
  [
    ActionTypes.REMOVE_ASYNC_TASK,
    () => {
      return produce(state, draft => {
        draft.data.asyncTaskCount = state.data.asyncTaskCount - 1;
      });
    },
  ],
  [
    ActionTypes.TOGGLE_SORT_DIRECTION,
    () => {
      const nextState = produce(state, draft => {
        draft.ui.sortDirection = draft.ui.sortDirection === 'desc' ? 'asc' : 'desc';
      });
      pullRequestItemProvider$.value = pullRequestItemProvider$.value.sort((a, b) =>
        sortByPullRequestId(a, b, nextState),
      );
      return nextState;
    },
  ],
];

const modifyObservables: SplitReducer = state => [
  [
    ActionTypes.TOGGLE_FILTER_BAR,
    () => {
      state.ui.isFilterVisible.value = !state.ui.isFilterVisible.value;
      return state;
    },
  ],
  [
    ActionTypes.TRIGGER_SORT_DIRECTION,
    () => {
      pullRequestItemProvider$.value = pullRequestItemProvider$.value.sort((a, b) => sortByPullRequestId(a, b, state));
      return state;
    },
  ],
];

export const reducer: Reducer<PrHubState, FetchAction> = (state: PrHubState = initialState, action: FetchAction) => {
  const reducerActions = new Map<Enum<typeof ActionTypes>, () => PrHubState>([
    ...setState(state, action),
    ...updateState(state, action),
    ...modifyObservables(state, action),
  ]);

  const callableReducerAction = reducerActions.get(action.type);
  return callableReducerAction ? callableReducerAction() : state;
};
