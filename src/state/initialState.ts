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
    requestLoading: {
      getPullRequests: 'init',
      getCompletedPullRequests: 'init',
      restoreSettings: 'init',
      saveSettings: 'init',
    },
  },
  ui: {
    isFullScreenMode: false,
    selectedTab: 'active',
    sortDirection: 'desc',
    daysAgo: '14',
  },
  settings: {
    autoRefreshDuration: 'off',
    settingsPanelOpen: false,
    defaults: {
      isFullScreenMode: false,
      selectedTab: 'active',
      sortDirection: 'desc',
      daysAgo: '14',
      isSavingFilterOptions: false,
      selectedFilterOptions: {
        searchString: [],
        repositories: [],
        sourceBranch: [],
        targetBranch: [],
        author: [],
        reviewer: [],
        myApprovalStatus: [],
      },
      autoRefreshDuration: 'off',
    },
  },
};
