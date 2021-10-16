import { IUserContext } from 'azure-devops-extension-sdk';
import { ObservableValue } from 'azure-devops-ui/Core/Observable';
import { IdentityRef } from 'azure-devops-extension-api/WebApi/WebApi';
import { WorkItem } from 'azure-devops-extension-api/WorkItemTracking/WorkItemTracking';
import { IdentityRefWithVote, PullRequestStatus } from 'azure-devops-extension-api/Git/Git';

import { ReviewerVoteNumber } from '../lib/enums';

const ADD_ASYNC_TASK = 'addAsyncTask';
const SET_FILTER_BAR = 'setFilterBar';
const SET_CURRENT_USER = 'setCurrentUser';
const SET_SELECTED_TAB = 'setSelectedTab';
const RESTORE_SETTINGS = 'restoreSettings';
const SET_REPOSITORIES = 'setRepositories';
const SET_FILTER_VALUES = 'setFilterValues';
const SET_PULL_REQUESTS = 'setPullRequests';
const REMOVE_ASYNC_TASK = 'removeAsyncTask';
const TOGGLE_FILTER_BAR = 'toggleFilterBar';
const DISPLAY_WORK_ITEMS = 'displayWorkItems';
const SET_SORT_DIRECTION = 'setSortDirection';
const SET_REFRESH_DURATION = 'setRefreshDuration';
const SET_FULL_SCREEN_MODE = 'setFullScreenMode';
const TOGGLE_SETTINGS_PANEL = 'toggleSettingsPanel';
const REFRESH_PULL_REQUESTS = 'refreshPullRequests';
const TOGGLE_SORT_DIRECTION = 'toggleSortDirection';
const PUSH_COMPLETED_PULL_REQUESTS = 'pushCompletedPullRequests';
const SET_FILTER_OPTION_SEARCH_STRING = 'setFilterOptionSearchString';

export const ActionTypes = {
  ADD_ASYNC_TASK,
  SET_FILTER_BAR,
  SET_CURRENT_USER,
  SET_SELECTED_TAB,
  RESTORE_SETTINGS,
  SET_REPOSITORIES,
  SET_FILTER_VALUES,
  SET_PULL_REQUESTS,
  REMOVE_ASYNC_TASK,
  TOGGLE_FILTER_BAR,
  DISPLAY_WORK_ITEMS,
  SET_SORT_DIRECTION,
  SET_REFRESH_DURATION,
  SET_FULL_SCREEN_MODE,
  TOGGLE_SETTINGS_PANEL,
  REFRESH_PULL_REQUESTS,
  TOGGLE_SORT_DIRECTION,
  PUSH_COMPLETED_PULL_REQUESTS,
  SET_FILTER_OPTION_SEARCH_STRING,
} as const;

export type RefreshDuration = 'off' | '60' | '300' | '900' | '3600';
export type DefaultSettings = {
  isFilterVisible: boolean;
  isFullScreenMode: boolean;
  selectedTab: TabOptions;
  sortDirection: SortDirection;
  isSavingFilterItems: boolean;
  filterValues: any; // TODO
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
