import { ObservableValue } from 'azure-devops-ui/Core/Observable';
import { PrHubState } from './types';

export const initialState: PrHubState = {
  data: {
    pullRequests: [],
    filterOptions: {
      searchString: [],
      repositories: [],
      sourceBranch: [],
      targetBranch: [],
      author: [],
      reviewer: [],
      myApprovalStatus: [],
    },
    currentUser: { id: '', name: '', displayName: '', descriptor: '', imageUrl: '' },
    asyncTaskCount: -1,
  },
  ui: {
    isFilterVisible: new ObservableValue(false),
    isFullScreenMode: false,
    selectedTab: 'active',
    sortDirection: 'desc',
  },
  settings: {
    autoRefreshDuration: 'off',
    settingsPanelOpen: false,
    defaults: {
      isFilterVisible: false,
      isFullScreenMode: false,
      selectedTab: 'active',
      sortDirection: 'desc',
      isSavingFilterItems: false,
      filterValues: undefined,
      autoRefreshDuration: 'off',
    },
  },
};
