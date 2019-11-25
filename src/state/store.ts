import { Reducer } from 'redux';
import { ObservableValue } from 'azure-devops-ui/Core/Observable';

import { FetchAction } from './actions';
import { ActionTypes, PrHubState } from './types';

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
  },
};

export const reducer: Reducer<PrHubState, FetchAction> = (state: PrHubState = initialState, action: FetchAction) => {
  switch (action.type) {
    case ActionTypes.SET_REPOSITORIES:
      return {
        ...state,
        data: {
          ...state.data,
          repositories: action.payload,
        },
      };
    case ActionTypes.SET_PULL_REQUESTS:
      return {
        ...state,
        data: {
          ...state.data,
          pullRequests: action.payload,
        },
      };
    case ActionTypes.SET_CURRENT_USER:
      return {
        ...state,
        data: {
          ...state.data,
          currentUser: action.payload,
        },
      };
    case ActionTypes.SET_SELECTED_TAB:
      return {
        ...state,
        ui: {
          ...state.ui,
          selectedTab: action.payload,
        },
      };
    case ActionTypes.TOGGLE_FILTER_BAR:
      state.ui.isFilterVisible.value = !state.ui.isFilterVisible.value;
      return state;
    case ActionTypes.TOGGLE_FULL_SCREEN_MODE:
      return {
        ...state,
        ui: {
          ...state.ui,
          isFullScreenMode: action.payload,
        },
      };
    case ActionTypes.ADD_ASYNC_TASK:
      return {
        ...state,
        data: {
          ...state.data,
          asyncTaskCount: state.data.asyncTaskCount + 1,
        },
      };
    case ActionTypes.REMOVE_ASYNC_TASK:
      return {
        ...state,
        data: {
          ...state.data,
          asyncTaskCount: state.data.asyncTaskCount - 1,
        },
      };
    default:
      return state;
  }
};
