import { Action, Dispatch } from 'redux';

// azure-devops-extension-sdk
import { getService, getUser, getExtensionContext, getAccessToken } from 'azure-devops-extension-sdk';

// azure-devops-extension-api
import { GitRestClient } from 'azure-devops-extension-api/Git/GitClient';
import {
  getClient,
  IProjectPageService,
  IHostPageLayoutService,
  IExtensionDataService,
  IExtensionDataManager,
} from 'azure-devops-extension-api';
import { GitPullRequestSearchCriteria, PullRequestStatus } from 'azure-devops-extension-api/Git/Git';
import { WorkItemTrackingRestClient } from 'azure-devops-extension-api/WorkItemTracking/WorkItemTrackingClient';

import { FilterDictionary } from '../tabs/TabTypes';
import { fromPullRequestToPR } from './transformData';
import { ActionTypes, DefaultSettings, SortDirection } from './types';
import { sortByRepositoryName, sortByPullRequestId } from '../lib/utils';

export interface FetchAction extends Action {
  payload?: any;
}

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
export const gitClient: GitRestClient = getClient(GitRestClient);
export const workItemClient: WorkItemTrackingRestClient = getClient(WorkItemTrackingRestClient);

const getRepositories = async () => {
  const projectService = await getService<IProjectPageService>('ms.vss-tfs-web.tfs-page-data-service');
  const currentProject = await projectService.getProject();
  return (await gitClient.getRepositories(currentProject?.name, true)).sort(sortByRepositoryName);
};

// const getWorkItemsForPr = async (pullRequest: GitPullRequest) => {
//   const workItemRefs = await gitClient.getPullRequestWorkItemRefs(pullRequest.repository.id, pullRequest.pullRequestId);
//   const workItemIds = workItemRefs.flatMap((ref: ResourceRef) => Number(ref.id));
//   return workItemIds.length > 0 ? await workItemClient.getWorkItems(workItemIds) : [];
// };

const getLayoutService = async (): Promise<IHostPageLayoutService> => {
  return await getService<IHostPageLayoutService>('ms.vss-features.host-page-layout-service');
};

const setFullScreenModeState = async (isFullScreenMode: boolean): Promise<boolean> => {
  const layoutService = await getLayoutService();
  layoutService.setFullScreenMode(isFullScreenMode);
  return isFullScreenMode;
};

export const setCurrentUser = () => (dispatch: Dispatch<FetchAction>) =>
  dispatch({ type: ActionTypes.SET_CURRENT_USER, payload: getUser() });

export const toggleSortDirection = () => (dispatch: Dispatch<FetchAction>) =>
  dispatch({ type: ActionTypes.TOGGLE_SORT_DIRECTION });

export const setSortDirection = (sortDirection: SortDirection) => (dispatch: Dispatch<FetchAction>) =>
  dispatch({ type: ActionTypes.SET_SORT_DIRECTION, payload: sortDirection });

export const triggerSortDirection = () => (dispatch: Dispatch<FetchAction>) =>
  dispatch({ type: ActionTypes.TRIGGER_SORT_DIRECTION });

export const setFilterValues = (filterValues: FilterDictionary) => (dispatch: Dispatch<FetchAction>) =>
  dispatch({ type: ActionTypes.SET_FILTER_VALUES, payload: filterValues });

export const setSelectedTab = (newSelectedTab: string) => (dispatch: Dispatch<FetchAction>) =>
  dispatch({ type: ActionTypes.SET_SELECTED_TAB, payload: newSelectedTab });

export const setFilterBar = (isFilterVisible: boolean) => (dispatch: Dispatch<FetchAction>) =>
  dispatch({ type: ActionTypes.SET_FILTER_BAR, payload: isFilterVisible });

export const toggleSettingsPanel = () => (dispatch: Dispatch<FetchAction>) =>
  dispatch({ type: ActionTypes.TOGGLE_SETTINGS_PANEL });

/**
 * @summary Asynchronously fetches all pull requests from all connected repositories in an Azure DevOps Project.
 * Makes additional calls to get complete information including:
 * - Work Items associated with the respective PR
 * - Auto Complete status
 */
export const setPullRequests = () => async (dispatch: Dispatch<FetchAction>) => {
  dispatch({ type: ActionTypes.ADD_ASYNC_TASK });
  const repositories = await getRepositories();
  const getAllRepositoryPullRequests = repositories.map(
    async repo => await gitClient.getPullRequests(repo.id, activePrCriteria),
  );
  getAllRepositoryPullRequests.push(
    ...repositories.map(
      async repo => await gitClient.getPullRequests(repo.id, completedPrCriteria, undefined, undefined, undefined, 10),
    ),
  );
  const allRepositoryPullRequests = await Promise.all(getAllRepositoryPullRequests);
  const getCompletePullRequests = allRepositoryPullRequests.flatMap(prsForSingleRepo =>
    prsForSingleRepo.map(async pr => await gitClient.getPullRequest(pr.repository.id, pr.pullRequestId)),
  );
  const allPullRequests = await Promise.all(getCompletePullRequests);
  const transformedPopulatedPullRequests = await Promise.all(
    allPullRequests.map(async pullRequest =>
      fromPullRequestToPR({
        pr: pullRequest,
        workItems: [],
        // workItems: await getWorkItemsForPr(pullRequest),
        userContext: getUser(),
      }),
    ),
  );
  dispatch({
    type: ActionTypes.SET_PULL_REQUESTS,
    payload: transformedPopulatedPullRequests.sort((a, b) =>
      sortByPullRequestId(a, b, { ui: { sortDirection: 'desc' } } as any),
    ),
  });
  dispatch({ type: ActionTypes.TRIGGER_SORT_DIRECTION });
  dispatch({ type: ActionTypes.REMOVE_ASYNC_TASK });
};

export const setRepositories = () => async (dispatch: Dispatch<FetchAction>) => {
  dispatch({ type: ActionTypes.ADD_ASYNC_TASK });
  const repositories = await getRepositories();
  dispatch({ type: ActionTypes.SET_REPOSITORIES, payload: repositories });
  dispatch({ type: ActionTypes.REMOVE_ASYNC_TASK });
};

export const setFullScreenMode = (isFullScreenMode: boolean) => async (dispatch: Dispatch<FetchAction>) => {
  const newFullScreenModeState = await setFullScreenModeState(isFullScreenMode);
  dispatch({ type: ActionTypes.SET_FULL_SCREEN_MODE, payload: newFullScreenModeState });
};

export const restoreSettings = () => async (dispatch: Dispatch<FetchAction>) => {
  const settings = await getSettings();
  await setFullScreenModeState(settings.isFullScreenMode);
  dispatch({ type: ActionTypes.RESTORE_SETTINGS, payload: settings });
  dispatch({ type: ActionTypes.TRIGGER_SORT_DIRECTION });
};

export const saveSettings = (defaultSettings: DefaultSettings) => async (dispatch: Dispatch<FetchAction>) => {
  const settings = await setSettings(defaultSettings);
  dispatch({ type: ActionTypes.RESTORE_SETTINGS, payload: settings });
};

export const onInitialLoad = () => {
  return (dispatch: Dispatch<any>) => {
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
