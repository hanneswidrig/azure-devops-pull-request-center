import React from 'react';
import { useDispatch } from 'react-redux';

import { FilterBar } from 'azure-devops-ui/FilterBar';
import { DropdownFilterBarItem } from 'azure-devops-ui/Dropdown';
import { KeywordFilterBarItem } from 'azure-devops-ui/TextFilterBarItem';
import { DropdownMultiSelection } from 'azure-devops-ui/Utilities/DropdownSelection';

import { ActionTypes } from '../state/types';
import { ApprovalStatusItem } from './ApprovalStatusItem';
import { Filter } from 'azure-devops-ui/Utilities/Filter';
import { FilterOptions, FilterItemsDictionary } from '../tabs/TabTypes';

type Props = { filter: Filter; filterItems: FilterItemsDictionary };
export const UIFilterBar: React.FC<Props> = ({ filter, filterItems }) => {
  const dispatch = useDispatch();
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
          selection={new DropdownMultiSelection()}
          showFilterBox={true}
          items={filterItems.repositories}
        />
        <DropdownFilterBarItem
          filterItemKey={FilterOptions.sourceBranch}
          placeholder={'Source Branch'}
          filter={filter}
          selection={new DropdownMultiSelection()}
          showFilterBox={true}
          items={filterItems.sourceBranch}
        />
        <DropdownFilterBarItem
          filterItemKey={FilterOptions.targetBranch}
          placeholder={'Target Branch'}
          filter={filter}
          selection={new DropdownMultiSelection()}
          showFilterBox={true}
          items={filterItems.targetBranch}
        />
        <DropdownFilterBarItem
          filterItemKey={FilterOptions.author}
          placeholder={'Author'}
          filter={filter}
          selection={new DropdownMultiSelection()}
          showFilterBox={true}
          items={filterItems.author}
        />
        <DropdownFilterBarItem
          filterItemKey={FilterOptions.reviewer}
          placeholder={'Reviewer'}
          filter={filter}
          selection={new DropdownMultiSelection()}
          showFilterBox={true}
          items={filterItems.reviewer}
        />
        <DropdownFilterBarItem
          filterItemKey={FilterOptions.myApprovalStatus}
          placeholder={'My Approval Status'}
          filter={filter}
          selection={new DropdownMultiSelection()}
          renderItem={ApprovalStatusItem}
          showFilterBox={true}
          items={filterItems.myApprovalStatus}
        />
      </FilterBar>
    </div>
  );
};
