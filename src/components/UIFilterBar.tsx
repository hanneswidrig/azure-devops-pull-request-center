import React from 'react';
import { useDispatch } from 'react-redux';
import { FilterBar } from 'azure-devops-ui/FilterBar';
import { IListBoxItem } from 'azure-devops-ui/ListBox';
import { DropdownFilterBarItem } from 'azure-devops-ui/Dropdown';
import { KeywordFilterBarItem } from 'azure-devops-ui/TextFilterBarItem';
import { DropdownMultiSelection } from 'azure-devops-ui/Utilities/DropdownSelection';

import { filter } from '..';
import { toggleFilterBar } from '../state/actions';
import { ApprovalStatusItem } from './ApprovalStatusItem';
import { FilterOptions, FilterItemsDictionary, FilterDictionaryNonNullable } from '../tabs/TabTypes';

const _repositories = new DropdownMultiSelection();
const _sourceBranch = new DropdownMultiSelection();
const _targetBranch = new DropdownMultiSelection();
const _author = new DropdownMultiSelection();
const _reviewer = new DropdownMultiSelection();
const _myApprovalStatus = new DropdownMultiSelection();

export const clearSelections = (): void => {
  _repositories.clear();
  _sourceBranch.clear();
  _targetBranch.clear();
  _author.clear();
  _reviewer.clear();
  _myApprovalStatus.clear();
};

type Props = { filterItems: FilterItemsDictionary };
export const UIFilterBar = ({ filterItems }: Props) => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    const defaultValues: FilterDictionaryNonNullable = {
      searchString: filter.getFilterItemValue<string>(FilterOptions.searchString) ?? '',
      repositories: filter.getFilterItemValue<string[]>(FilterOptions.repositories) ?? [],
      sourceBranch: filter.getFilterItemValue<string[]>(FilterOptions.sourceBranch) ?? [],
      targetBranch: filter.getFilterItemValue<string[]>(FilterOptions.targetBranch) ?? [],
      author: filter.getFilterItemValue<string[]>(FilterOptions.author) ?? [],
      reviewer: filter.getFilterItemValue<string[]>(FilterOptions.reviewer) ?? [],
      myApprovalStatus: filter.getFilterItemValue<string[]>(FilterOptions.myApprovalStatus) ?? [],
    };
    const matchedFilterValues = matchingFilterValues(defaultValues, filterItems);
    selectExistingDefaultFilterValue(matchedFilterValues, filterItems);
  }, [filterItems]);

  return (
    <div className={'margin-bottom-16'}>
      <FilterBar filter={filter} onDismissClicked={() => dispatch(toggleFilterBar())}>
        <KeywordFilterBarItem
          filterItemKey={FilterOptions.searchString}
          placeholder={'Search Across Pull Requests'}
          filter={filter}
        />
        <DropdownFilterBarItem
          filterItemKey={FilterOptions.repositories}
          placeholder={'Repositories'}
          filter={filter}
          selection={_repositories}
          showFilterBox={true}
          items={filterItems.repositories}
        />
        <DropdownFilterBarItem
          filterItemKey={FilterOptions.sourceBranch}
          placeholder={'Source Branch'}
          filter={filter}
          selection={_sourceBranch}
          showFilterBox={true}
          items={filterItems.sourceBranch}
        />
        <DropdownFilterBarItem
          filterItemKey={FilterOptions.targetBranch}
          placeholder={'Target Branch'}
          filter={filter}
          selection={_targetBranch}
          showFilterBox={true}
          items={filterItems.targetBranch}
        />
        <DropdownFilterBarItem
          filterItemKey={FilterOptions.author}
          placeholder={'Author'}
          filter={filter}
          selection={_author}
          showFilterBox={true}
          items={filterItems.author}
        />
        <DropdownFilterBarItem
          filterItemKey={FilterOptions.reviewer}
          placeholder={'Reviewer'}
          filter={filter}
          selection={_reviewer}
          showFilterBox={true}
          items={filterItems.reviewer}
        />
        <DropdownFilterBarItem
          filterItemKey={FilterOptions.myApprovalStatus}
          placeholder={'My Approval Status'}
          filter={filter}
          selection={_myApprovalStatus}
          renderItem={ApprovalStatusItem}
          showFilterBox={true}
          items={filterItems.myApprovalStatus}
        />
      </FilterBar>
    </div>
  );
};

type ExtractCommonValues = (
  listBoxItem: IListBoxItem<{}>[],
  defaultValuesItem: string | string[],
) => IListBoxItem<{}>[];

type MatchingFilterValues = (
  defaultValues: FilterDictionaryNonNullable,
  filterItems: FilterItemsDictionary,
) => FilterItemsDictionary;

type SelectExistingDefaultFilterValue = (
  matchedFilterValues: FilterItemsDictionary,
  allFilterItems: FilterItemsDictionary,
) => void;

const extractCommonValues: ExtractCommonValues = (listBoxItem, defaultValuesItem) => {
  const matchingValues = listBoxItem.filter(item => defaultValuesItem.includes(item.id));
  return listBoxItem.length > 0 ? matchingValues : [];
};

const matchingFilterValues: MatchingFilterValues = (defaultValues, filterItems) => {
  return {
    repositories: extractCommonValues(filterItems.repositories, defaultValues.repositories),
    sourceBranch: extractCommonValues(filterItems.sourceBranch, defaultValues.sourceBranch),
    targetBranch: extractCommonValues(filterItems.targetBranch, defaultValues.targetBranch),
    author: extractCommonValues(filterItems.author, defaultValues.author),
    reviewer: extractCommonValues(filterItems.reviewer, defaultValues.reviewer),
    myApprovalStatus: extractCommonValues(filterItems.myApprovalStatus, defaultValues.myApprovalStatus),
  };
};

const selectExistingDefaultFilterValue: SelectExistingDefaultFilterValue = (matchedFilterValues, allFilterItems) => {
  matchedFilterValues.repositories.forEach(item =>
    _repositories.select(allFilterItems.repositories.findIndex(filterItem => filterItem.id === item.id)),
  );
  matchedFilterValues.sourceBranch.forEach(item =>
    _sourceBranch.select(allFilterItems.sourceBranch.findIndex(filterItem => filterItem.id === item.id)),
  );
  matchedFilterValues.targetBranch.forEach(item =>
    _targetBranch.select(allFilterItems.targetBranch.findIndex(filterItem => filterItem.id === item.id)),
  );
  matchedFilterValues.author.forEach(item =>
    _author.select(allFilterItems.author.findIndex(filterItem => filterItem.id === item.id)),
  );
  matchedFilterValues.reviewer.forEach(item =>
    _reviewer.select(allFilterItems.reviewer.findIndex(filterItem => filterItem.id === item.id)),
  );
  matchedFilterValues.myApprovalStatus.forEach(item =>
    _myApprovalStatus.select(allFilterItems.myApprovalStatus.findIndex(filterItem => filterItem.id === item.id)),
  );
};
