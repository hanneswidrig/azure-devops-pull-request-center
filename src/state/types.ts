import { IUserContext } from 'azure-devops-extension-sdk';
import { IdentityRef } from 'azure-devops-extension-api/WebApi/WebApi';
import { WorkItem } from 'azure-devops-extension-api/WorkItemTracking/WorkItemTracking';
import { IdentityRefWithVote, PullRequestStatus } from 'azure-devops-extension-api/Git/Git';

import { ReviewerVoteNumber } from '../lib/enums';

export const ActionTypes = {
  ADD_ASYNC_TASK: 'addAsyncTask',
  SET_CURRENT_USER: 'setCurrentUser',
  SET_SELECTED_TAB: 'setSelectedTab',
  RESTORE_SETTINGS: 'restoreSettings',
  SET_REPOSITORIES: 'setRepositories',
  SET_PULL_REQUESTS: 'setPullRequests',
  REMOVE_ASYNC_TASK: 'removeAsyncTask',
  TOGGLE_FILTER_BAR: 'toggleFilterBar',
  SET_FILTER_OPTIONS: 'setFilterOptions',
  DISPLAY_WORK_ITEMS: 'displayWorkItems',
  SET_SORT_DIRECTION: 'setSortDirection',
  SET_REFRESH_DURATION: 'setRefreshDuration',
  SET_FULL_SCREEN_MODE: 'setFullScreenMode',
  TOGGLE_SETTINGS_PANEL: 'toggleSettingsPanel',
  REFRESH_PULL_REQUESTS: 'refreshPullRequests',
  TOGGLE_SORT_DIRECTION: 'toggleSortDirection',
  PUSH_COMPLETED_PULL_REQUESTS: 'pushCompletedPullRequests',
} as const;

export type RefreshDuration = 'off' | '60' | '300' | '900' | '3600';
export type DefaultSettings = {
  isFullScreenMode: boolean;
  selectedTab: TabOptions;
  sortDirection: SortDirection;
  isSavingFilterOptions: boolean;
  selectedFilterOptions: FilterOptions;
  autoRefreshDuration: RefreshDuration;
};

export type Settings = {
  autoRefreshDuration: RefreshDuration;
  settingsPanelOpen: boolean;
  defaults: DefaultSettings;
};

type PRRef = { name: string; href: string };
export type PR = {
  pullRequestId: number;
  repositoryId: string;
  isDraft: boolean;
  isActive: boolean;
  isCompleted: boolean;
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

const searchString = 'searchString';
const repositories = 'repositories';
const sourceBranch = 'sourceBranch';
const targetBranch = 'targetBranch';
const author = 'author';
const reviewer = 'reviewer';
const myApprovalStatus = 'myApprovalStatus';
export const options = [searchString, repositories, sourceBranch, targetBranch, author, reviewer, myApprovalStatus] as const;

export type FilterOption = { label: string; value: string };
export type FilterOptions = Record<typeof options[number], FilterOption[]>;

export type Data = {
  pullRequests: PR[];
  filterOptions: FilterOptions;
  currentUser: IUserContext;
  asyncTaskCount: number;
};

export type TabOptions = 'active' | 'draft' | 'completed';
export type SortDirection = 'desc' | 'asc';

export type UI = {
  isFullScreenMode: boolean;
  selectedTab: TabOptions;
  sortDirection: SortDirection;
};

export type PrHubState = {
  settings: Settings;
  data: Data;
  ui: UI;
};
