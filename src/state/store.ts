import produce from 'immer';
import { Reducer } from 'redux';

import { initialState } from './initialState';
import { sortByCreationDate } from '../lib/utils';
import { defaults } from '../components/SettingsPanel';
import { Enum, FetchAction, SplitReducer } from '../lib/typings';
import { ActionTypes, DefaultSettings, FilterOptions, PR, PrHubState, SortDirection } from './types';

const setState: SplitReducer = (state, action) => [
  [
    ActionTypes.SET_CURRENT_USER,
    () => {
      return produce(state, (draft) => {
        draft.data.currentUser = action.payload;
      });
    },
  ],
  [
    ActionTypes.SET_FULL_SCREEN_MODE,
    () => {
      return produce(state, (draft) => {
        draft.ui.isFullScreenMode = action.payload;
      });
    },
  ],
  [
    ActionTypes.SET_SORT_DIRECTION,
    () => {
      return produce(state, (draft) => {
        const sortDirection: SortDirection = action.payload;
        draft.ui.sortDirection = sortDirection;
        draft.data.pullRequests = [...state.data.pullRequests].sort((a, b) => sortByCreationDate(a, b, sortDirection));
      });
    },
  ],
  [
    ActionTypes.SET_DAYS_AGO,
    () => {
      return produce(state, (draft) => {
        draft.ui.daysAgo = action.payload;
        draft.data.pullRequests = [...state.data.pullRequests].sort((a, b) => sortByCreationDate(a, b, state.ui.sortDirection));
      });
    },
  ],
  [
    ActionTypes.SET_PULL_REQUESTS,
    () => {
      return produce(state, (draft) => {
        const pullRequests: PR[] = action.payload;
        draft.data.pullRequests = pullRequests.sort((a, b) => sortByCreationDate(a, b, state.ui.sortDirection));
      });
    },
  ],
  [
    ActionTypes.SET_COMPLETED_PULL_REQUESTS,
    () => {
      return produce(state, (draft) => {
        const completedPullRequests: PR[] = action.payload;
        const activePullRequests = state.data.pullRequests.filter((pr) => !pr.isCompleted);
        const pullRequests = [...activePullRequests, ...completedPullRequests];
        draft.data.pullRequests = pullRequests.sort((a, b) => sortByCreationDate(a, b, state.ui.sortDirection));
      });
    },
  ],
  [
    ActionTypes.RESTORE_SETTINGS,
    () => {
      if (action.payload) {
        const savedSettings: Partial<DefaultSettings> = action.payload;
        return produce(state, (draft) => {
          draft.ui.isFullScreenMode = savedSettings.isFullScreenMode ?? defaults.isFullScreenMode;
          draft.ui.selectedTab = savedSettings.selectedTab ?? defaults.selectedTab;
          draft.ui.sortDirection = savedSettings.sortDirection ?? defaults.sortDirection;
          draft.ui.daysAgo = savedSettings.daysAgo ?? defaults.daysAgo;
          draft.settings.autoRefreshDuration = savedSettings.autoRefreshDuration ?? defaults.autoRefreshDuration;

          draft.settings.defaults.isFullScreenMode = savedSettings.isFullScreenMode ?? defaults.isFullScreenMode;
          draft.settings.defaults.selectedTab = savedSettings.selectedTab ?? defaults.selectedTab;
          draft.settings.defaults.sortDirection = savedSettings.sortDirection ?? defaults.sortDirection;
          draft.settings.defaults.daysAgo = savedSettings.daysAgo ?? defaults.daysAgo;
          draft.settings.defaults.isSavingFilterOptions = savedSettings.isSavingFilterOptions ?? defaults.isSavingFilterOptions;
          draft.settings.defaults.selectedFilterOptions = savedSettings.selectedFilterOptions ?? defaults.selectedFilterOptions;
          draft.settings.defaults.autoRefreshDuration = savedSettings.autoRefreshDuration ?? defaults.autoRefreshDuration;
        });
      }
      return state;
    },
  ],
  [
    ActionTypes.SET_SELECTED_TAB,
    () => {
      return produce(state, (draft) => {
        draft.ui.selectedTab = action.payload;
      });
    },
  ],
  [
    ActionTypes.SET_REFRESH_DURATION,
    () => {
      return produce(state, (draft) => {
        draft.settings.autoRefreshDuration = action.payload;
      });
    },
  ],
  [
    ActionTypes.SET_FILTER_OPTIONS,
    () => {
      return produce(state, (draft) => {
        const filterOptions: FilterOptions = action.payload;
        draft.data.filterOptions.searchString = filterOptions.searchString;
        draft.data.filterOptions.repositories = filterOptions.repositories;
        draft.data.filterOptions.sourceBranch = filterOptions.sourceBranch;
        draft.data.filterOptions.targetBranch = filterOptions.targetBranch;
        draft.data.filterOptions.author = filterOptions.author;
        draft.data.filterOptions.reviewer = filterOptions.reviewer;
        draft.data.filterOptions.myApprovalStatus = filterOptions.myApprovalStatus;
      });
    },
  ],
];

const updateState: SplitReducer = (state) => [
  [
    ActionTypes.ADD_ASYNC_TASK,
    () => {
      return produce(state, (draft) => {
        draft.data.asyncTaskCount = state.data.asyncTaskCount + 1;
      });
    },
  ],
  [
    ActionTypes.REMOVE_ASYNC_TASK,
    () => {
      return produce(state, (draft) => {
        draft.data.asyncTaskCount = state.data.asyncTaskCount - 1;
      });
    },
  ],
  [
    ActionTypes.TOGGLE_SORT_DIRECTION,
    () => {
      return produce(state, (draft) => {
        draft.ui.sortDirection = state.ui.sortDirection === 'desc' ? 'asc' : 'desc';
        draft.data.pullRequests = [...state.data.pullRequests].sort((a, b) => sortByCreationDate(a, b, draft.ui.sortDirection));
      });
    },
  ],
  [
    ActionTypes.TOGGLE_SETTINGS_PANEL,
    () => {
      return produce(state, (draft) => {
        draft.settings.settingsPanelOpen = !state.settings.settingsPanelOpen;
      });
    },
  ],
];

export const reducer: Reducer<PrHubState, any> = (state: PrHubState = initialState, action: FetchAction) => {
  const reducerActions = new Map<Enum<typeof ActionTypes>, () => PrHubState>([...setState(state, action), ...updateState(state, action)]);
  const callableReducerAction = reducerActions.get(action.type);
  return callableReducerAction ? callableReducerAction() : state;
};
