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
import { GitPullRequestSearchCriteria, GitRepository, PullRequestStatus } from 'azure-devops-extension-api/Git/Git';
import { getAccessToken, getExtensionContext, getService, getUser } from 'azure-devops-extension-sdk';
import { WorkItemTrackingRestClient } from 'azure-devops-extension-api/WorkItemTracking/WorkItemTrackingClient';

import { store } from '..';
import { Task } from '../lib/typings';
import { FilterDictionary } from '../tabs/TabTypes';
import { fromPullRequestToPR } from './transformData';
import { pullRequestItemProvider$ } from '../tabs/TabProvider';
import { defaultSettingValues } from '../components/SettingsPanel';
import { sortByPullRequestId, sortByRepositoryName } from '../lib/utils';
import { ActionTypes, DefaultSettings, RefreshDuration, SortDirection } from './types';

export const activePrCriteria: GitPullRequestSearchCriteria = {
  repositoryId: '',
  creatorId: '',
  includeLinks: true,
  reviewerId: '',
  sourceRefName: '',
  sourceRepositoryId: '',
  status: PullRequestStatus.Active,
  targetRefName: '',
};

export const completedPrCriteria: GitPullRequestSearchCriteria = {
  repositoryId: '',
  creatorId: '',
  includeLinks: true,
  reviewerId: '',
  sourceRefName: '',
  sourceRepositoryId: '',
  status: PullRequestStatus.Completed,
  targetRefName: '',
};

// VSTS REST Clients
export const coreClient: CoreRestClient = getClient(CoreRestClient);
export const gitClient: GitRestClient = getClient(GitRestClient);
export const workItemClient: WorkItemTrackingRestClient = getClient(WorkItemTrackingRestClient);

const getRepositories = async () => {
  const projectService = await getService<IProjectPageService>('ms.vss-tfs-web.tfs-page-data-service');
  const currentProject = await projectService.getProject();
  const repositories = await gitClient.getRepositories(currentProject?.id);
  return repositories.sort(sortByRepositoryName);
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

export const toggleSortDirection: Task = () => (dispatch, getState) => {
  const nextSortDirection = getState().ui.sortDirection === 'desc' ? 'asc' : 'desc';
  pullRequestItemProvider$.value = pullRequestItemProvider$.value.sort((a, b) => sortByPullRequestId(a, b, nextSortDirection));
  dispatch({ type: ActionTypes.TOGGLE_SORT_DIRECTION });
};

export const toggleFilterBar: Task = () => (dispatch) => {
  dispatch({ type: ActionTypes.TOGGLE_FILTER_BAR });
};

export const setSortDirection: Task<{ sortDirection: SortDirection }> =
  ({ sortDirection }) =>
  (dispatch) => {
    dispatch({ type: ActionTypes.SET_SORT_DIRECTION, payload: sortDirection });
  };

export const triggerSortDirection = () => {
  pullRequestItemProvider$.value = pullRequestItemProvider$.value.sort((a, b) =>
    sortByPullRequestId(a, b, store.getState().ui.sortDirection)
  );
};

export const setFilterValues: Task<{ filterValues: FilterDictionary }> =
  ({ filterValues }) =>
  (dispatch) => {
    dispatch({ type: ActionTypes.SET_FILTER_VALUES, payload: filterValues });
  };

export const setSelectedTab: Task<{ newSelectedTab: string }> =
  ({ newSelectedTab }) =>
  (dispatch) => {
    dispatch({ type: ActionTypes.SET_SELECTED_TAB, payload: newSelectedTab });
  };

export const setRefreshDuration: Task<{ refreshDuration: RefreshDuration }> =
  ({ refreshDuration }) =>
  (dispatch) => {
    dispatch({ type: ActionTypes.SET_REFRESH_DURATION, payload: refreshDuration });
  };

export const setFilterBar: Task<{ isFilterVisible: boolean }> =
  ({ isFilterVisible }) =>
  (dispatch) => {
    dispatch({ type: ActionTypes.SET_FILTER_BAR, payload: isFilterVisible });
  };

export const toggleSettingsPanel: Task = () => (dispatch) => dispatch({ type: ActionTypes.TOGGLE_SETTINGS_PANEL });

/**
 * @summary Asynchronously fetches all pull requests from all connected repositories in an Azure DevOps Project.
 * Makes additional calls to get complete information including:
 * - Work Items associated with the respective PR
 * - Auto Complete status
 */
export const setPullRequests: Task = () => async (dispatch) => {
  try {
    dispatch({ type: ActionTypes.ADD_ASYNC_TASK });
    const repositories = await getRepositories();

    const allRepositoryPullRequests = await Promise.all(
      repositories.map(async (repo) => await gitClient.getPullRequests(repo.id, activePrCriteria))
    );
    console.debug(allRepositoryPullRequests[0]);

    const allPullRequests = await Promise.all(
      allRepositoryPullRequests.flatMap((prsForSingleRepo) =>
        prsForSingleRepo.map(async (pr) => await gitClient.getPullRequest(pr.repository.id, pr.pullRequestId))
      )
    );

    const transformedPullRequests = await Promise.all(
      allPullRequests.map(async (pr) => fromPullRequestToPR({ pr: pr, workItems: [], userContext: getUser() }))
    );

    dispatch({
      type: ActionTypes.SET_PULL_REQUESTS,
      payload: transformedPullRequests.sort((a, b) => sortByPullRequestId(a, b, 'desc')),
    });
    triggerSortDirection();
    dispatch({ type: ActionTypes.REMOVE_ASYNC_TASK });
    dispatch(setCompletedPullRequests(repositories));
  } catch {
    const globalMessagesSvc = await getService<IGlobalMessagesService>('ms.vss-tfs-web.tfs-global-messages-service');
    globalMessagesSvc.addToast({
      duration: 5000,
      message: 'An error occurred while fetching pull requests. Please reload or refresh the page.',
      forceOverrideExisting: true,
    });
  }
};

export const setCompletedPullRequests: Task<GitRepository[]> = (repositories: GitRepository[]) => async (dispatch) => {
  try {
    const allRepositoryPullRequests = await Promise.all(
      repositories.map(async (repo) => await gitClient.getPullRequests(repo.id, completedPrCriteria, undefined, undefined, 0, 25))
    );

    const allPullRequests = await Promise.all(
      allRepositoryPullRequests.flatMap((singleRepoPr) =>
        singleRepoPr.map(async (pr) => await gitClient.getPullRequest(pr.repository.id, pr.pullRequestId))
      )
    );

    const transformedPullRequests = await Promise.all(
      allPullRequests.map(async (pr) => fromPullRequestToPR({ pr, workItems: [], userContext: getUser() }))
    );

    dispatch({
      type: ActionTypes.PUSH_COMPLETED_PULL_REQUESTS,
      payload: transformedPullRequests.sort((a, b) => sortByPullRequestId(a, b, 'desc')),
    });
    triggerSortDirection();
  } catch {
    const globalMessagesSvc = await getService<IGlobalMessagesService>('ms.vss-tfs-web.tfs-global-messages-service');
    globalMessagesSvc.addToast({
      duration: 5000,
      message: 'An error occurred while fetching pull requests. Please reload or refresh the page.',
      forceOverrideExisting: true,
    });
  }
};

export const setRepositories: Task = () => async (dispatch) => {
  try {
    dispatch({ type: ActionTypes.ADD_ASYNC_TASK });
    const repositories = await getRepositories();
    dispatch({ type: ActionTypes.SET_REPOSITORIES, payload: repositories });
    dispatch({ type: ActionTypes.REMOVE_ASYNC_TASK });
  } catch {
    const globalMessagesSvc = await getService<IGlobalMessagesService>('ms.vss-tfs-web.tfs-global-messages-service');
    globalMessagesSvc.addToast({
      duration: 5000,
      message: 'An error occurred while fetching pull requests. Please reload or refresh the page.',
      forceOverrideExisting: true,
    });
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
      triggerSortDirection();
    } else {
      await setSettings(defaultSettingValues);
    }
    dispatch({ type: ActionTypes.REMOVE_ASYNC_TASK });
  } catch {
    const globalMessagesSvc = await getService<IGlobalMessagesService>('ms.vss-tfs-web.tfs-global-messages-service');
    globalMessagesSvc.addToast({
      duration: 5000,
      message: 'An error occurred while fetching pull requests. Please reload or refresh the page.',
      forceOverrideExisting: true,
    });
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
    dispatch(setCurrentUser());
    dispatch(setRepositories());
    dispatch(setPullRequests());
    dispatch(restoreSettings());
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
