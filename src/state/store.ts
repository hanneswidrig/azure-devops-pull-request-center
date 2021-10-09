import produce from 'immer';
import { Reducer } from 'redux';

import { initialState } from './initialState';
import { Enum, SplitReducer, FetchAction } from '../lib/typings';
import { ActionTypes, PrHubState, DefaultSettings } from './types';
import { defaultSettingValues } from '../components/SettingsPanel';

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
        draft.ui.sortDirection = action.payload;
      });
    },
  ],
  [
    ActionTypes.SET_PULL_REQUESTS,
    () => {
      return produce(state, (draft) => {
        draft.data.pullRequests = action.payload;
      });
    },
  ],
  [
    ActionTypes.PUSH_COMPLETED_PULL_REQUESTS,
    () => {
      const existingNonCompletedPullRequests = state.data.pullRequests.filter((pr) => !pr.isCompleted);
      return produce(state, (draft) => {
        draft.data.pullRequests = [...existingNonCompletedPullRequests, ...action.payload];
      });
    },
  ],
  [
    ActionTypes.SET_REPOSITORIES,
    () => {
      return produce(state, (draft) => {
        draft.data.repositories = action.payload;
      });
    },
  ],
  [
    ActionTypes.RESTORE_SETTINGS,
    () => {
      if (action.payload) {
        const savedSettings: Partial<DefaultSettings> = action.payload;
        return produce(state, (draft) => {
          draft.ui.isFilterVisible.value = savedSettings.isFilterVisible ?? defaultSettingValues.isFilterVisible;
          draft.ui.isFullScreenMode = savedSettings.isFullScreenMode ?? defaultSettingValues.isFullScreenMode;
          draft.ui.selectedTab = savedSettings.selectedTab ?? defaultSettingValues.selectedTab;
          draft.ui.sortDirection = savedSettings.sortDirection ?? defaultSettingValues.sortDirection;
          draft.settings.autoRefreshDuration =
            savedSettings.autoRefreshDuration ?? defaultSettingValues.autoRefreshDuration;

          draft.settings.defaults.isFilterVisible =
            savedSettings.isFilterVisible ?? defaultSettingValues.isFilterVisible;
          draft.settings.defaults.isFullScreenMode =
            savedSettings.isFullScreenMode ?? defaultSettingValues.isFullScreenMode;
          draft.settings.defaults.selectedTab = savedSettings.selectedTab ?? defaultSettingValues.selectedTab;
          draft.settings.defaults.sortDirection = savedSettings.sortDirection ?? defaultSettingValues.sortDirection;
          draft.settings.defaults.isSavingFilterItems =
            savedSettings.isSavingFilterItems ?? defaultSettingValues.isSavingFilterItems;
          draft.settings.defaults.filterValues = savedSettings.filterValues;
          draft.settings.defaults.autoRefreshDuration =
            savedSettings.autoRefreshDuration ?? defaultSettingValues.autoRefreshDuration;
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
    ActionTypes.SET_FILTER_BAR,
    () => {
      state.ui.isFilterVisible.value = action.payload;
      return state;
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
];

const updateState: SplitReducer = (state) => [
  [
    ActionTypes.ADD_ASYNC_TASK,
    () => {
      return produce(state, (draft) => {
        draft.data.asyncTaskCount = state.data.asyncTaskCount === -1 ? 1 : state.data.asyncTaskCount + 1;
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

const modifyObservables: SplitReducer = (state) => [
  [
    ActionTypes.TOGGLE_FILTER_BAR,
    () => {
      state.ui.isFilterVisible.value = !state.ui.isFilterVisible.value;
      return state;
    },
  ],
];

export const reducer: Reducer<PrHubState, any> = (state: PrHubState = initialState, action: FetchAction) => {
  const reducerActions = new Map<Enum<typeof ActionTypes>, () => PrHubState>([
    ...setState(state, action),
    ...updateState(state, action),
    ...modifyObservables(state, action),
  ]);

  const callableReducerAction = reducerActions.get(action.type);
  return callableReducerAction ? callableReducerAction() : state;
};
