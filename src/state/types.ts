import * as DevOps from 'azure-devops-extension-sdk';
import { ObservableValue } from 'azure-devops-ui/Core/Observable';
import { IdentityRef } from 'azure-devops-extension-api/WebApi/WebApi';
import { WorkItem } from 'azure-devops-extension-api/WorkItemTracking/WorkItemTracking';
import { IdentityRefWithVote, PullRequestStatus, GitRepository } from 'azure-devops-extension-api/Git/Git';

import { TabOptions } from '../tabs/Tabs.types';
import { ReviewerVoteLabel } from '../lib/enums';

const SET_REPOSITORIES = 'setRepositories';
const SET_PULL_REQUESTS = 'setPullRequests';
const SET_CURRENT_USER = 'setCurrentUser';
const SET_SELECTED_TAB = 'setSelectedTab';
const ADD_ASYNC_TASK = 'addAsyncTask';
const REMOVE_ASYNC_TASK = 'removeAsyncTask';
const TOGGLE_FILTER_BAR = 'toggleFilterBar';
const DISPLAY_WORK_ITEMS = 'displayWorkItems';
const REFRESH_PULL_REQUESTS = 'refreshPullRequests';
const TOGGLE_FULL_SCREEN_MODE = 'toggleFullScreenMode';

export const ActionTypes = {
  SET_REPOSITORIES,
  SET_PULL_REQUESTS,
  SET_CURRENT_USER,
  SET_SELECTED_TAB,
  ADD_ASYNC_TASK,
  REMOVE_ASYNC_TASK,
  TOGGLE_FILTER_BAR,
  DISPLAY_WORK_ITEMS,
  REFRESH_PULL_REQUESTS,
  TOGGLE_FULL_SCREEN_MODE
} as const;

export interface PR {
  pullRequestId: number;
  repositoryId: string;
  isDraft: boolean;
  isAutoComplete: boolean;
  status: PullRequestStatus;

  title: string;
  href: string;
  createdBy: IdentityRef;
  creationDate: Date;
  secondaryTitle: string;

  sourceBranch: PRRef;
  targetBranch: PRRef;
  repository: PRRef;

  myApprovalStatus: ReviewerVoteLabel;

  workItems: WorkItem[];
  reviewers: IdentityRefWithVote[];
}

type PRRef = { name: string; href: string };

export interface Data {
  repositories: GitRepository[];
  pullRequests: PR[];
  currentUser: DevOps.IUserContext;
  asyncTaskCount: number;
}

export interface UI {
  isFilterVisible: ObservableValue<boolean>;
  isFullScreenMode: boolean;
  selectedTab: TabOptions;
}

export interface PrHubState {
  data: Data;
  ui: UI;
}
