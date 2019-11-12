import { IListBoxItem } from 'azure-devops-ui/ListBox';

const searchString = 'searchString';
const repositories = 'repositories';
const sourceBranch = 'sourceBranch';
const targetBranch = 'targetBranch';
const author = 'author';
const reviewer = 'reviewer';
const myApprovalStatus = 'myApprovalStatus';
const allFilterOptions = [
  searchString,
  repositories,
  sourceBranch,
  targetBranch,
  author,
  reviewer,
  myApprovalStatus
] as const;

export const FilterOptions = {
  searchString,
  repositories,
  sourceBranch,
  targetBranch,
  author,
  reviewer,
  myApprovalStatus
};
export type FilterTypes = typeof allFilterOptions[number];
export type FilterDictionary = Record<FilterTypes, string | string[] | undefined>;
export type FilterItemsDictionary = Record<Exclude<FilterTypes, typeof searchString>, IListBoxItem[]>;
