import { FilterTypes } from '../tabs/TabTypes';
import { PR, TabOptions } from '../state/types';

export type FilterFunc = (pullRequest: PR, filterValue: string[]) => boolean;
type TabFilterFunc = (pullRequest: PR) => boolean;

type IFilterSetup = {
  func: FilterFunc;
  val: string[];
  isActive: boolean;
};

export const filterByTitle: FilterFunc = (pullRequest, filterValue) =>
  pullRequest.title.toLocaleLowerCase().indexOf(filterValue[0].toLocaleLowerCase()) > -1 ||
  pullRequest.pullRequestId.toString().indexOf(filterValue[0].toLocaleLowerCase()) > -1 ||
  pullRequest.repository.name.toLocaleLowerCase().indexOf(filterValue[0].toLocaleLowerCase()) > -1 ||
  pullRequest.sourceBranch.name.toLocaleLowerCase().indexOf(filterValue[0].toLocaleLowerCase()) > -1 ||
  pullRequest.targetBranch.name.toLocaleLowerCase().indexOf(filterValue[0].toLocaleLowerCase()) > -1 ||
  pullRequest.createdBy.displayName.toLocaleLowerCase().indexOf(filterValue[0].toLocaleLowerCase()) > -1;

export const filterByRepositoryId: FilterFunc = (pullRequest, filterValue) =>
  filterValue.some(v => pullRequest.repositoryId === v);

export const filterBySourceBranchDisplayName: FilterFunc = (pullRequest, filterValue) =>
  filterValue.some(v => pullRequest.sourceBranch.name === v);

export const filterByTargetBranchDisplayName: FilterFunc = (pullRequest, filterValue) =>
  filterValue.some(v => pullRequest.targetBranch.name === v);

export const filterByCreatedByUserId: FilterFunc = (pullRequest, filterValue) =>
  filterValue.some(v => pullRequest.createdBy.id === v);

export const filterByReviewers: FilterFunc = (pullRequest, filterValue) =>
  filterValue.some(v => pullRequest.reviewers.some(r => r.id === v));

export const filterByApprovalStatus: FilterFunc = (pullRequest, filterValue) =>
  pullRequest.myApprovalStatus.toString() === filterValue[0].toString();

export const filterByDraftStatus: TabFilterFunc = pullRequest => pullRequest.isDraft;

export const filterByActiveStatus: TabFilterFunc = pullRequest => pullRequest.isActive && !pullRequest.isDraft;

export const filterByCompletedStatus: TabFilterFunc = pullRequest => pullRequest.isCompleted;

export const setupFilters = (filterValues: Partial<Record<FilterTypes, any>>, tab: TabOptions) => {
  const { searchString, repositories, sourceBranch, targetBranch, author, reviewer, myApprovalStatus } = filterValues;
  const opts: Record<TabOptions, IFilterSetup[]> = {
    active: [
      {
        func: filterByTitle,
        val: [searchString || ''],
        isActive: searchString !== undefined && searchString.length > 0 && searchString[0].length > 0,
      },
      {
        func: filterByRepositoryId,
        val: repositories || [],
        isActive: repositories !== undefined && repositories.length > 0,
      },
      {
        func: filterBySourceBranchDisplayName,
        val: sourceBranch || [],
        isActive: sourceBranch !== undefined && sourceBranch.length > 0,
      },
      {
        func: filterByTargetBranchDisplayName,
        val: targetBranch || [],
        isActive: targetBranch !== undefined && targetBranch.length > 0,
      },
      {
        func: filterByCreatedByUserId,
        val: author || [],
        isActive: author !== undefined && author.length > 0,
      },
      {
        func: filterByReviewers,
        val: reviewer || [],
        isActive: reviewer !== undefined && reviewer.length > 0,
      },
      {
        func: filterByApprovalStatus,
        val: myApprovalStatus || [],
        isActive: myApprovalStatus !== undefined && myApprovalStatus.length > 0,
      },
      {
        func: filterByActiveStatus,
        val: undefined,
        isActive: true,
      },
    ],
    draft: [
      {
        func: filterByTitle,
        val: [searchString || ''],
        isActive: searchString !== undefined && searchString.length > 0 && searchString[0].length > 0,
      },
      {
        func: filterByRepositoryId,
        val: repositories || [],
        isActive: repositories !== undefined && repositories.length > 0,
      },
      {
        func: filterBySourceBranchDisplayName,
        val: sourceBranch || [],
        isActive: sourceBranch !== undefined && sourceBranch.length > 0,
      },
      {
        func: filterByTargetBranchDisplayName,
        val: targetBranch || [],
        isActive: targetBranch !== undefined && targetBranch.length > 0,
      },
      {
        func: filterByCreatedByUserId,
        val: author || [],
        isActive: author !== undefined && author.length > 0,
      },
      {
        func: filterByReviewers,
        val: reviewer || [],
        isActive: reviewer !== undefined && reviewer.length > 0,
      },
      {
        func: filterByApprovalStatus,
        val: myApprovalStatus || [],
        isActive: myApprovalStatus !== undefined && myApprovalStatus.length > 0,
      },
      {
        func: filterByDraftStatus,
        val: undefined,
        isActive: true,
      },
    ],
    completed: [
      {
        func: filterByTitle,
        val: [searchString || ''],
        isActive: searchString !== undefined && searchString.length > 0 && searchString[0].length > 0,
      },
      {
        func: filterByRepositoryId,
        val: repositories || [],
        isActive: repositories !== undefined && repositories.length > 0,
      },
      {
        func: filterBySourceBranchDisplayName,
        val: sourceBranch || [],
        isActive: sourceBranch !== undefined && sourceBranch.length > 0,
      },
      {
        func: filterByTargetBranchDisplayName,
        val: targetBranch || [],
        isActive: targetBranch !== undefined && targetBranch.length > 0,
      },
      {
        func: filterByCreatedByUserId,
        val: author || [],
        isActive: author !== undefined && author.length > 0,
      },
      {
        func: filterByReviewers,
        val: reviewer || [],
        isActive: reviewer !== undefined && reviewer.length > 0,
      },
      {
        func: filterByApprovalStatus,
        val: myApprovalStatus || [],
        isActive: myApprovalStatus !== undefined && myApprovalStatus.length > 0,
      },
      {
        func: filterByCompletedStatus,
        val: undefined,
        isActive: true,
      },
    ],
  };
  return opts[tab].filter(fs => fs.isActive);
};

export const applyFilter = (valArray: PR[], fv: Partial<Record<FilterTypes, any>>, tab: TabOptions) => {
  const appliedFilters = setupFilters(fv, tab);

  if (appliedFilters.length > 0) {
    return valArray.filter(val => {
      let found = false;
      for (const iterator of appliedFilters) {
        found = iterator.func(val, iterator.val);
        if (!found) {
          break;
        }
      }
      return found;
    });
  }

  return valArray;
};

export const defaultFilterValues: Record<FilterTypes, any> = {
  searchString: undefined,
  repositories: undefined,
  sourceBranch: undefined,
  targetBranch: undefined,
  author: undefined,
  reviewer: undefined,
  myApprovalStatus: undefined,
};
