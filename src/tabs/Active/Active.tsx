import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Card } from 'azure-devops-ui/Card';
import { Table } from 'azure-devops-ui/Table';
import { Spinner } from 'office-ui-fabric-react';
import { FilterBar } from 'azure-devops-ui/FilterBar';
import { DropdownFilterBarItem } from 'azure-devops-ui/Dropdown';
import { KeywordFilterBarItem } from 'azure-devops-ui/TextFilterBarItem';
import { ConditionalChildren } from 'azure-devops-ui/ConditionalChildren';
import { DropdownMultiSelection } from 'azure-devops-ui/Utilities/DropdownSelection';

import './Active.scss';

import { ITab, FilterOptions } from '../Tabs.types';
import { ActionTypes, PrHubState, PR } from '../../state/types';
import { pullRequestItemProvider$, columns } from '../TabsProvider';
import { ApprovalStatusItem } from '../../components/ApprovalStatusItem';

export const Active: React.FC<ITab> = ({ filter, filterItems }) => {
  const { data, ui } = useSelector((store: PrHubState) => store);
  const dispatch = useDispatch();

  return (
    <div className='flex-column'>
      <ConditionalChildren renderChildren={ui.isFilterVisible}>
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
      </ConditionalChildren>
      {data.asyncTaskCount === 0 ? (
        <Card className='flex-grow bolt-table-card' contentProps={{ contentPadding: false }}>
          <Table<PR> columns={columns} itemProvider={pullRequestItemProvider$} showLines={true} role='table' />
        </Card>
      ) : (
        <Spinner label='fetching pull requests...' size={3} className='center-spinner' />
      )}
    </div>
  );
};
