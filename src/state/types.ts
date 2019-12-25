import * as DevOps from 'azure-devops-extension-sdk';
import { ObservableValue } from 'azure-devops-ui/Core/Observable';
import { IdentityRef } from 'azure-devops-extension-api/WebApi/WebApi';
import { WorkItem } from 'azure-devops-extension-api/WorkItemTracking/WorkItemTracking';
import { IdentityRefWithVote, PullRequestStatus, GitRepository } from 'azure-devops-extension-api/Git/Git';

import { ReviewerVoteNumber } from '../lib/enums';

const GET_SETTINGS = 'getSettings';
const SET_SETTINGS = 'setSettings';
const ADD_ASYNC_TASK = 'addAsyncTask';
const SET_CURRENT_USER = 'setCurrentUser';
const SET_SELECTED_TAB = 'setSelectedTab';
const RESTORE_SETTINGS = 'restoreSettings';
const SET_REPOSITORIES = 'setRepositories';
const SET_FILTER_VALUES = 'setFilterValues';
const SET_PULL_REQUESTS = 'setPullRequests';
const REMOVE_ASYNC_TASK = 'removeAsyncTask';
const TOGGLE_FILTER_BAR = 'toggleFilterBar';
const DISPLAY_WORK_ITEMS = 'displayWorkItems';
const SET_FULL_SCREEN_MODE = 'setFullScreenMode';
const TOGGLE_SETTINGS_PANEL = 'toggleSettingsPanel';
const REFRESH_PULL_REQUESTS = 'refreshPullRequests';
const TOGGLE_SORT_DIRECTION = 'toggleSortDirection';
const TRIGGER_SORT_DIRECTION = 'triggerSortDirection';

export const ActionTypes = {
  GET_SETTINGS,
  SET_SETTINGS,
  ADD_ASYNC_TASK,
  SET_CURRENT_USER,
  SET_SELECTED_TAB,
  RESTORE_SETTINGS,
  SET_REPOSITORIES,
  SET_FILTER_VALUES,
  SET_PULL_REQUESTS,
  REMOVE_ASYNC_TASK,
  TOGGLE_FILTER_BAR,
  DISPLAY_WORK_ITEMS,
  SET_FULL_SCREEN_MODE,
  TOGGLE_SETTINGS_PANEL,
  REFRESH_PULL_REQUESTS,
  TOGGLE_SORT_DIRECTION,
  TRIGGER_SORT_DIRECTION,
} as const;

export type DefaultSettings = {
  isFilterVisible: boolean;
  isFullScreenMode: boolean;
  selectedTab: TabOptions;
  sortDirection: SortDirection;
};

export type Settings = {
  settingsLastSaved: string;
  settingsPanelOpen: boolean;
};

export type PR = {
  pullRequestId: number;
  repositoryId: string;
  isDraft: boolean;
  isAutoComplete: boolean;
  hasMergeConflicts: boolean;
  status: PullRequestStatus;

  title: string;
  href: string;
  createdBy: IdentityRef;
  creationDate: Date;
  secondaryTitle: string;

  sourceBranch: PRRef;
  targetBranch: PRRef;
  repository: PRRef;

  myApprovalStatus: ReviewerVoteNumber;

  workItems: WorkItem[];
  reviewers: IdentityRefWithVote[];
};

type PRRef = { name: string; href: string };
export type Data = {
  repositories: GitRepository[];
  pullRequests: PR[];
  currentUser: DevOps.IUserContext;
  asyncTaskCount: number;
};

export type SortDirection = 'desc' | 'asc';
export type TabOptions = 'active' | 'draft';
export type UI = {
  isFilterVisible: ObservableValue<boolean>;
  isFullScreenMode: boolean;
  selectedTab: TabOptions;
  sortDirection: SortDirection;
};

export type PrHubState = {
  settings: Settings;
  data: Data;
  ui: UI;
};
