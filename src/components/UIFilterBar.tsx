import React from 'react';
import { useDispatch } from 'react-redux';
import { FilterBar } from 'azure-devops-ui/FilterBar';
import { DropdownFilterBarItem } from 'azure-devops-ui/Dropdown';
import { KeywordFilterBarItem } from 'azure-devops-ui/TextFilterBarItem';
import { DropdownMultiSelection } from 'azure-devops-ui/Utilities/DropdownSelection';

import { filter } from '..';
import { ActionTypes } from '../state/types';
import { ApprovalStatusItem } from './ApprovalStatusItem';
import { FilterOptions, FilterItemsDictionary } from '../tabs/TabTypes';

const _repositories = new DropdownMultiSelection();
const _sourceBranch = new DropdownMultiSelection();
const _targetBranch = new DropdownMultiSelection();
const _author = new DropdownMultiSelection();
const _reviewer = new DropdownMultiSelection();
const _myApprovalStatus = new DropdownMultiSelection();

type Props = { filterItems: FilterItemsDictionary };
export const UIFilterBar: React.FC<Props> = ({ filterItems }: Props) => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (filterItems.repositories.length > 0) {
    }
    if (filterItems.sourceBranch.length > 0) {
    }
    if (filterItems.targetBranch.length > 0) {
    }
    if (filterItems.author.length > 0) {
    }
    if (filterItems.reviewer.length > 0) {
    }
    if (filterItems.myApprovalStatus.length > 0) {
    }
  }, [filterItems]);

  return (
    <div className={'margin-bottom-16'}>
      <FilterBar filter={filter} onDismissClicked={() => dispatch({ type: ActionTypes.TOGGLE_FILTER_BAR })}>
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
