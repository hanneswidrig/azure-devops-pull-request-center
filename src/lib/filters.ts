import { PR } from '../state/types';
import { FilterTypes } from '../tabs/Active/Active.types';

export type FilterFunc = (pullRequest: PR, filterValue: string[]) => boolean;
export interface IFilterSetup {
  func: FilterFunc;
  val: string[];
  isActive: boolean;
}

export const filterByTitle: FilterFunc = (pullRequest, filterValue) =>
  pullRequest.title.toLocaleLowerCase().indexOf(filterValue[0].toLocaleLowerCase()) > -1;

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

export const filterByDraftStatus: FilterFunc = (pullRequest, filterValue) => pullRequest.isDraft === false;

export const andFilter = (valArray: PR[], fv: Partial<Record<FilterTypes, any>>) => {
  const { searchString, repositories, sourceBranch, targetBranch, author, reviewer, myApprovalStatus } = fv;
  const filterSetup: IFilterSetup[] = [
    {
      func: filterByTitle,
      val: [searchString || ''],
      isActive: searchString !== undefined && searchString.length > 0 && searchString[0].length > 0
    },
    {
      func: filterByRepositoryId,
      val: repositories || [],
      isActive: repositories !== undefined && repositories.length > 0
    },
    {
      func: filterBySourceBranchDisplayName,
      val: sourceBranch || [],
      isActive: sourceBranch !== undefined && sourceBranch.length > 0
    },
    {
      func: filterByTargetBranchDisplayName,
      val: targetBranch || [],
      isActive: targetBranch !== undefined && targetBranch.length > 0
    },
    {
      func: filterByCreatedByUserId,
      val: author || [],
      isActive: author !== undefined && author.length > 0
    },
    {
      func: filterByReviewers,
      val: reviewer || [],
      isActive: reviewer !== undefined && reviewer.length > 0
    },
    {
      func: filterByApprovalStatus,
      val: myApprovalStatus || [],
      isActive: myApprovalStatus !== undefined && myApprovalStatus.length > 0
    },
    {
      func: filterByDraftStatus,
      val: [],
      isActive: true
    }
  ];
  const appliedFilters = filterSetup.filter(fs => fs.isActive);

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
