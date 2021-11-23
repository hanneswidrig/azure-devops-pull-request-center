import {
  getClient,
  IExtensionDataManager,
  IExtensionDataService,
  IGlobalMessagesService,
  IHostPageLayoutService,
  IProjectPageService,
} from 'azure-devops-extension-api';
import { CoreRestClient } from 'azure-devops-extension-api/Core/CoreClient';
import { GitRestClient } from 'azure-devops-extension-api/Git/GitClient';
import Git, { GitPullRequestSearchCriteria, PullRequestStatus } from 'azure-devops-extension-api/Git/Git';
import { getAccessToken, getExtensionContext, getService, getUser } from 'azure-devops-extension-sdk';
import { WorkItemTrackingRestClient } from 'azure-devops-extension-api/WorkItemTracking/WorkItemTrackingClient';

import { Task } from '../lib/typings';
import { toPr } from './transformData';
import { sortByRepositoryName } from '../lib/utils';
import { defaults } from '../components/SettingsPanel';
import { ActionTypes, DaysAgo, DefaultSettings, FilterOptions, PR, RefreshDuration, SortDirection } from './types';

interface GitRepository extends Git.GitRepository {
  isDisabled: boolean;
}

const criteria = (status: PullRequestStatus): GitPullRequestSearchCriteria => {
  return {
    repositoryId: '',
    creatorId: '',
    includeLinks: true,
    reviewerId: '',
    sourceRefName: '',
    sourceRepositoryId: '',
    status: status,
    targetRefName: '',
  };
};

const apiErrorMessage = 'An error occurred while fetching pull requests. Please reload or refresh the page.';

export const coreClient = getClient<CoreRestClient>(CoreRestClient);
export const gitClient = getClient<GitRestClient>(GitRestClient);
export const workItemClient = getClient<WorkItemTrackingRestClient>(WorkItemTrackingRestClient);

const getRepositories = async () => {
  const projectService = await getService<IProjectPageService>('ms.vss-tfs-web.tfs-page-data-service');
  const currentProject = await projectService.getProject();
  const repositories = (await gitClient.getRepositories(currentProject?.id)) as GitRepository[];
  return repositories.sort(sortByRepositoryName).filter(({ isDisabled }) => !isDisabled);
};

const getLayoutService = async (): Promise<IHostPageLayoutService> => {
  return await getService<IHostPageLayoutService>('ms.vss-features.host-page-layout-service');
};

const setFullScreenModeState = async (isFullScreenMode: boolean): Promise<boolean> => {
  const layoutService = await getLayoutService();
  layoutService.setFullScreenMode(isFullScreenMode);
  return isFullScreenMode;
};

export const setCurrentUser: Task = () => (dispatch) => {
  dispatch({ type: ActionTypes.SET_CURRENT_USER, payload: getUser() });
};

export const toggleSortDirection: Task = () => (dispatch) => {
  dispatch({ type: ActionTypes.TOGGLE_SORT_DIRECTION });
};

export const setSortDirection: Task<{ sortDirection: SortDirection }> =
  ({ sortDirection }) =>
  (dispatch) => {
    dispatch({ type: ActionTypes.SET_SORT_DIRECTION, payload: sortDirection });
  };

export const setDaysAgo: Task<{ daysAgo: DaysAgo }> =
  ({ daysAgo }) =>
  (dispatch) => {
    dispatch({ type: ActionTypes.SET_DAYS_AGO, payload: daysAgo });
  };

export const setFilterOptions: Task<FilterOptions> = (filterOptions) => (dispatch) => {
  dispatch({ type: ActionTypes.SET_FILTER_OPTIONS, payload: filterOptions });
};

export const setSelectedTab: Task<{ selectedTab: string }> =
  ({ selectedTab }) =>
  (dispatch) => {
    dispatch({ type: ActionTypes.SET_SELECTED_TAB, payload: selectedTab });
  };

export const setRefreshDuration: Task<{ refreshDuration: RefreshDuration }> =
  ({ refreshDuration }) =>
  (dispatch) => {
    dispatch({ type: ActionTypes.SET_REFRESH_DURATION, payload: refreshDuration });
  };

export const toggleSettingsPanel: Task = () => (dispatch) => dispatch({ type: ActionTypes.TOGGLE_SETTINGS_PANEL });

export const setPullRequests: Task = () => async (dispatch) => {
  try {
    dispatch({ type: ActionTypes.ADD_ASYNC_TASK });
    const repositories = await getRepositories();
    const allPrs = await Promise.all(repositories.flatMap((repo) => fetchPullRequests(repo, criteria(PullRequestStatus.Active), 25)));
    dispatch({ type: ActionTypes.SET_PULL_REQUESTS, payload: allPrs.reduce((prev, curr) => [...prev, ...curr], []) });
    dispatch(setCompletedPullRequests(repositories));
  } catch {
    const globalMessagesSvc = await getService<IGlobalMessagesService>('ms.vss-tfs-web.tfs-global-messages-service');
    globalMessagesSvc.addToast({ duration: 5000, message: apiErrorMessage, forceOverrideExisting: true });
  }
};

export const setCompletedPullRequests: Task<GitRepository[]> = (repositories: GitRepository[]) => async (dispatch) => {
  try {
    const allPrs = await Promise.all(repositories.flatMap((repo) => fetchPullRequests(repo, criteria(PullRequestStatus.Completed), 25)));
    dispatch({ type: ActionTypes.SET_COMPLETED_PULL_REQUESTS, payload: allPrs.reduce((prev, curr) => [...prev, ...curr], []) });
    dispatch({ type: ActionTypes.REMOVE_ASYNC_TASK });
  } catch {
    const globalMessagesSvc = await getService<IGlobalMessagesService>('ms.vss-tfs-web.tfs-global-messages-service');
    globalMessagesSvc.addToast({ duration: 5000, message: apiErrorMessage, forceOverrideExisting: true });
  }
};

export const setFullScreenMode: Task<{ isFullScreenMode: boolean }> =
  ({ isFullScreenMode }) =>
  async (dispatch) => {
    const newFullScreenModeState = await setFullScreenModeState(isFullScreenMode);
    dispatch({ type: ActionTypes.SET_FULL_SCREEN_MODE, payload: newFullScreenModeState });
  };

export const restoreSettings: Task = () => async (dispatch) => {
  try {
    dispatch({ type: ActionTypes.ADD_ASYNC_TASK });
    const settings = await getSettings();
    if (settings) {
      await setFullScreenModeState(settings.isFullScreenMode);
      dispatch({ type: ActionTypes.RESTORE_SETTINGS, payload: settings });
    } else {
      await setSettings(defaults);
    }
    dispatch({ type: ActionTypes.REMOVE_ASYNC_TASK });
  } catch {
    const globalMessagesSvc = await getService<IGlobalMessagesService>('ms.vss-tfs-web.tfs-global-messages-service');
    globalMessagesSvc.addToast({ duration: 5000, message: apiErrorMessage, forceOverrideExisting: true });
  }
};

export const saveSettings: Task<{ defaultSettings: DefaultSettings }> =
  ({ defaultSettings }) =>
  async (dispatch) => {
    const settings = await setSettings(defaultSettings);
    dispatch({ type: ActionTypes.RESTORE_SETTINGS, payload: settings });
  };

export const onInitialLoad: Task = () => {
  return (dispatch) => {
    dispatch(restoreSettings());
    dispatch(setCurrentUser());
    dispatch(setPullRequests());
  };
};

const getDataManagementContext = async (): Promise<IExtensionDataManager> => {
  const extensionId = getExtensionContext().id;
  const accessToken = await getAccessToken();
  const extensionDataService = await getService<IExtensionDataService>('ms.vss-features.extension-data-service');
  return extensionDataService.getExtensionDataManager(extensionId, accessToken);
};

const getSettings = async (): Promise<DefaultSettings> => {
  const dbKey = `prc-ext-data-default`;
  const context = await getDataManagementContext();
  return context.getValue(dbKey, { defaultValue: null });
};

const setSettings = async (data: DefaultSettings): Promise<DefaultSettings> => {
  const dbKey = `prc-ext-data-default`;
  const context = await getDataManagementContext();
  return context.setValue(dbKey, data);
};

async function fetchPullRequests(repo: GitRepository, criteria: GitPullRequestSearchCriteria, take: number): Promise<PR[]> {
  let skip = 0;
  const userContext = getUser();
  const pullRequests: PR[] = [];

  do {
    const prsPerRepo = await gitClient.getPullRequests(repo.id, criteria, undefined, undefined, skip, take);
    const prs = prsPerRepo.map((pr) => toPr({ pr, workItems: [], userContext }));
    pullRequests.push(...prs);
    skip = skip + take;
  } while (pullRequests.length !== 0 && pullRequests.length % take === 0);

  return pullRequests;
}
