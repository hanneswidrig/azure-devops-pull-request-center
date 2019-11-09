import { Filter } from "azure-devops-ui/Utilities/Filter";
import { IReadonlyObservableValue } from "azure-devops-ui/Core/Observable";

import { PR } from "../../state/types";
import { IListBoxItem } from "azure-devops-ui/ListBox";

export const SEARCH_STRING = "searchString";
export const REPOSITORIES = "repositories";
export const SOURCE_BRANCH = "sourceBranch";
export const TARGET_BRANCH = "targetBranch";
export const AUTHOR = "author";
export const REVIEWER = "reviewer";
export const MY_APPROVAL_STATUS = "myApprovalStatus";

const allFilters = [
  SEARCH_STRING,
  REPOSITORIES,
  SOURCE_BRANCH,
  TARGET_BRANCH,
  AUTHOR,
  REVIEWER,
  MY_APPROVAL_STATUS
] as const;
export type FilterTypes = typeof allFilters[number];
export type FilterDictionary = Record<FilterTypes, string | string[] | undefined>;
export type FilterItemsDictionary = Record<Exclude<FilterTypes, typeof SEARCH_STRING>, IListBoxItem[]>;

export interface IActive {
  filter: Filter;
}

export type ActiveItemProvider = PR | IReadonlyObservableValue<PR | undefined>;
