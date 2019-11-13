import { Action, Dispatch } from 'redux';

// azure-devops-extension-sdk
import * as DevOps from 'azure-devops-extension-sdk';

// azure-devops-extension-api
import { ResourceRef } from 'azure-devops-extension-api/WebApi/WebApi';
import { GitRestClient } from 'azure-devops-extension-api/Git/GitClient';
import { getClient, IProjectPageService, IHostPageLayoutService } from 'azure-devops-extension-api';
import { WorkItemTrackingRestClient } from 'azure-devops-extension-api/WorkItemTracking/WorkItemTrackingClient';

import { ActionTypes } from './types';
import { fromPullRequestToPR } from './transformData';
import { sortByRepositoryName } from '../lib/utilities';
import { GitPullRequest, GitPullRequestSearchCriteria, PullRequestStatus } from 'azure-devops-extension-api/Git/Git';

// action interfaces
export interface FetchAction extends Action {
  payload?: any;
}

// criteria setup
export const pullRequestCriteria: GitPullRequestSearchCriteria = {
  repositoryId: '',
  creatorId: '',
  includeLinks: true,
  reviewerId: '',
  sourceRefName: '',
  sourceRepositoryId: '',
  status: PullRequestStatus.Active,
  targetRefName: ''
};

// VSTS REST Clients
export const gitClient: GitRestClient = getClient(GitRestClient);
export const workItemClient: WorkItemTrackingRestClient = getClient(WorkItemTrackingRestClient);

/**
 * @summary Synchronously sets current user in redux store
 */
export const setCurrentUser = () => {
  return (dispatch: Dispatch<FetchAction>) =>
    dispatch({ type: ActionTypes.SET_CURRENT_USER, payload: DevOps.getUser() });
};

export const setSelectedTab = (newSelectedTab: string) => {
  return (dispatch: Dispatch<FetchAction>) => dispatch({ type: ActionTypes.SET_SELECTED_TAB, payload: newSelectedTab });
};

/**
 * @summary Asynchronously fetches all pull requests from all connected repositories in an Azure DevOps Project.
 * Makes additional calls to get complete information including:
 * - Work Items associated with the respective PR
 * - Auto Complete status
 */
export const setPullRequests = () => {
  return async (dispatch: Dispatch<FetchAction>) => {
    try {
      dispatch({ type: ActionTypes.ADD_ASYNC_TASK });
      const repositories = await getRepositories();
      const getAllRepositoryPullRequests = repositories.map(
        async repo => await gitClient.getPullRequests(repo.id, pullRequestCriteria)
      );
      const allRepositoryPullRequests = await Promise.all(getAllRepositoryPullRequests);
      const getCompletePullRequests = allRepositoryPullRequests.flatMap(prsForSingleRepo =>
        prsForSingleRepo.map(async pr => await gitClient.getPullRequest(pr.repository.id, pr.pullRequestId))
      );
      const allPullRequests = await Promise.all(getCompletePullRequests);
      const transformedPopulatedPullRequests = await Promise.all(
        allPullRequests.map(async pullRequest =>
          fromPullRequestToPR({
            pr: pullRequest,
            workItems: await getWorkItemsForPr(pullRequest),
            userContext: DevOps.getUser()
          })
        )
      );
      dispatch({ type: ActionTypes.SET_PULL_REQUESTS, payload: transformedPopulatedPullRequests });
      dispatch({ type: ActionTypes.REMOVE_ASYNC_TASK });
    } catch (error) {
      throw error;
    }
  };
};

/**
 * @summary Set repositories in redux store
 */
export const setRepositories = () => {
  return async (dispatch: Dispatch<FetchAction>) => {
    try {
      dispatch({ type: ActionTypes.ADD_ASYNC_TASK });
      const repositories = await getRepositories();
      dispatch({ type: ActionTypes.SET_REPOSITORIES, payload: repositories });
      dispatch({ type: ActionTypes.REMOVE_ASYNC_TASK });
    } catch (error) {
      throw error;
    }
  };
};

/**
 * @summary Toggle full screen mode for extension
 */
export const toggleFullScreenMode = () => {
  return async (dispatch: Dispatch<FetchAction>) => {
    try {
      const newFullScreenModeState = await setFullScreenMode();
      dispatch({ type: ActionTypes.TOGGLE_FULL_SCREEN_MODE, payload: newFullScreenModeState });
    } catch (error) {
      throw error;
    }
  };
};

const getRepositories = async () => {
  const projectService = await DevOps.getService<IProjectPageService>('ms.vss-tfs-web.tfs-page-data-service');
  const currentProject = await projectService.getProject();
  return (await gitClient.getRepositories(currentProject!.name, true)).sort(sortByRepositoryName);
};

const getWorkItemsForPr = async (pullRequest: GitPullRequest) => {
  const workItemRefs = await gitClient.getPullRequestWorkItemRefs(pullRequest.repository.id, pullRequest.pullRequestId);
  const workItemIds = workItemRefs.flatMap((ref: ResourceRef) => Number(ref.id));
  return workItemIds.length > 0 ? await workItemClient.getWorkItems(workItemIds) : [];
};

const setFullScreenMode = async (): Promise<boolean> => {
  const layoutService = await DevOps.getService<IHostPageLayoutService>('ms.vss-features.host-page-layout-service');
  const fullScreenMode = await layoutService.getFullScreenMode();
  layoutService.setFullScreenMode(!fullScreenMode);
  return !fullScreenMode;
};
