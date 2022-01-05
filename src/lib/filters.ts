import { filterByCreationDate } from './utils';
import { DaysAgo, FilterOption, FilterOptions, PR, TabOptions } from '../state/types';

type IFilterSetup = {
  filterBy: Filter;
  criteria: FilterOption[];
  isActive: boolean;
};

type Filter = (pullRequest: PR, values: FilterOption[]) => boolean;

const title: Filter = (pullRequest, values) => {
  const searchValue = values[0].label.toLocaleLowerCase();
  return (
    pullRequest.title.toLocaleLowerCase().indexOf(searchValue) > -1 ||
    pullRequest.pullRequestId.toString().toLocaleLowerCase().indexOf(searchValue.replace(/#/g, '')) > -1 ||
    pullRequest.repository.name.toLocaleLowerCase().indexOf(searchValue) > -1 ||
    pullRequest.sourceBranch.name.toLocaleLowerCase().indexOf(searchValue) > -1 ||
    pullRequest.targetBranch.name.toLocaleLowerCase().indexOf(searchValue) > -1 ||
    pullRequest.createdBy.displayName.toLocaleLowerCase().indexOf(searchValue) > -1
  );
};
const repositoryId: Filter = (pullRequest, values) => values.some(({ value }) => pullRequest.repositoryId === value);
const sourceBranchName: Filter = (pullRequest, values) => values.some(({ value }) => pullRequest.sourceBranch.name === value);
const targetBranchName: Filter = (pullRequest, values) => values.some(({ value }) => pullRequest.targetBranch.name === value);
const createdByUserId: Filter = (pullRequest, values) => values.some(({ value }) => pullRequest.createdBy.id === value);
const reviewers: Filter = (pullRequest, values) => values.some(({ value }) => pullRequest.reviewers.some((r) => r.id === value));
const approvalStatus: Filter = (pullRequest, values) => {
  return values.some(({ value }) => value.toString() === pullRequest.myApprovalStatus.toString());
};
const draftStatus: Filter = (pullRequest) => pullRequest.isDraft;
const activeStatus: Filter = (pullRequest) => pullRequest.isActive && !pullRequest.isDraft;
const completedStatus: Filter = (pullRequest) => pullRequest.isCompleted;
const creationDate: Filter = (pullRequest, values) => filterByCreationDate(pullRequest, values[0].value as DaysAgo);

const setupFilters = (filterOptions: FilterOptions, selectedTab: TabOptions, daysAgo: DaysAgo) => {
  const { searchString, repositories, sourceBranch, targetBranch, author, reviewer, myApprovalStatus } = filterOptions;

  const filters: IFilterSetup[] = [
    { filterBy: title, criteria: searchString, isActive: searchString.length > 0 },
    { filterBy: repositoryId, criteria: repositories, isActive: repositories.length > 0 },
    { filterBy: sourceBranchName, criteria: sourceBranch, isActive: sourceBranch.length > 0 },
    { filterBy: targetBranchName, criteria: targetBranch, isActive: targetBranch.length > 0 },
    { filterBy: createdByUserId, criteria: author, isActive: author.length > 0 },
    { filterBy: reviewers, criteria: reviewer, isActive: reviewer.length > 0 },
    { filterBy: approvalStatus, criteria: myApprovalStatus, isActive: myApprovalStatus.length > 0 },
  ];

  if (selectedTab === 'active') {
    filters.push({ filterBy: activeStatus, criteria: [], isActive: true });
  }

  if (selectedTab === 'draft') {
    filters.push({ filterBy: draftStatus, criteria: [], isActive: true });
  }

  if (selectedTab === 'completed') {
    filters.push({ filterBy: completedStatus, criteria: [], isActive: true });
  }

  if (daysAgo !== '-1') {
    filters.push({ filterBy: creationDate, criteria: [{ label: '', value: daysAgo }], isActive: true });
  }

  return filters.filter(({ isActive }) => isActive);
};

const setupFiltersForFilterOptions = (selectedTab: TabOptions, daysAgo: DaysAgo) => {
  const filters: IFilterSetup[] = [];

  if (selectedTab === 'active') {
    filters.push({ filterBy: activeStatus, criteria: [], isActive: true });
  }

  if (selectedTab === 'draft') {
    filters.push({ filterBy: draftStatus, criteria: [], isActive: true });
  }

  if (selectedTab === 'completed') {
    filters.push({ filterBy: completedStatus, criteria: [], isActive: true });
  }

  if (daysAgo !== '-1') {
    filters.push({ filterBy: creationDate, criteria: [{ label: '', value: daysAgo }], isActive: true });
  }

  return filters.filter(({ isActive }) => isActive);
};

export const applyFilters = (pullRequests: PR[], filterOptions: FilterOptions, selectedTab: TabOptions, daysAgo: DaysAgo) => {
  const appliedFilters = setupFilters(filterOptions, selectedTab, daysAgo);

  if (appliedFilters.length > 0) {
    return pullRequests.filter((value) => {
      let found = false;
      for (const iterator of appliedFilters) {
        found = iterator.filterBy(value, iterator.criteria);
        if (!found) {
          break;
        }
      }
      return found;
    });
  }

  return pullRequests;
};

export const applyPreciseFilters = (pullRequests: PR[], selectedTab: TabOptions, daysAgo: DaysAgo) => {
  const appliedFilters = setupFiltersForFilterOptions(selectedTab, daysAgo);

  if (appliedFilters.length > 0) {
    return pullRequests.filter((value) => {
      let found = false;
      for (const iterator of appliedFilters) {
        found = iterator.filterBy(value, iterator.criteria);
        if (!found) {
          break;
        }
      }
      return found;
    });
  }

  return pullRequests;
};
