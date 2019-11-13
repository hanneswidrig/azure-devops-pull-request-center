import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Card } from 'azure-devops-ui/Card';
import { Spinner } from 'office-ui-fabric-react';
import { FilterBar } from 'azure-devops-ui/FilterBar';
import { DropdownFilterBarItem } from 'azure-devops-ui/Dropdown';
import { ObservableArray } from 'azure-devops-ui/Core/Observable';
import { FILTER_CHANGE_EVENT } from 'azure-devops-ui/Utilities/Filter';
import { Table, ITableColumn, ColumnMore } from 'azure-devops-ui/Table';
import { KeywordFilterBarItem } from 'azure-devops-ui/TextFilterBarItem';
import { ConditionalChildren } from 'azure-devops-ui/ConditionalChildren';
import { DropdownMultiSelection } from 'azure-devops-ui/Utilities/DropdownSelection';

import './Active.scss';

import { applyFilter } from '../../lib/filters';
import { ITab, ActiveItemProvider } from '../Tabs.types';
import { ActionTypes, PrHubState, PR } from '../../state/types';
import { fromPRToFilterItems } from '../../state/transformData';
import { ApprovalStatusItem } from '../../components/ApprovalStatusItem';
import { renderTitleColumn, renderReviewersColumn } from '../../components/Columns';
import { FilterOptions, FilterDictionary, FilterItemsDictionary } from './Active.types';

const pullRequestItemProvider$ = new ObservableArray<ActiveItemProvider>();
export const Active: React.FC<ITab> = ({ filter }) => {
  const { data, ui } = useSelector((store: PrHubState) => store);
  const dispatch = useDispatch();
  const [filterItems, setFilterItems] = React.useState<FilterItemsDictionary>({
    repositories: [],
    sourceBranch: [],
    targetBranch: [],
    author: [],
    reviewer: [],
    myApprovalStatus: []
  });

  const columns: ITableColumn<PR>[] = [
    {
      id: 'title',
      name: 'Pull Request',
      renderCell: renderTitleColumn,
      width: -100
    },
    {
      id: 'reviewers',
      name: 'Reviewers',
      renderCell: renderReviewersColumn,
      width: 416
    },
    new ColumnMore(data => {
      return {
        id: 'sub-menu',
        items: [
          {
            id: 'submenu-one',
            text: 'Show Work Items',
            iconProps: { iconName: 'WorkItem' },
            onActivate: () => {}
          }
        ]
      };
    })
  ];

  React.useEffect(() => {
    pullRequestItemProvider$.splice(0, pullRequestItemProvider$.length);
    pullRequestItemProvider$.push(...applyFilter(data.pullRequests, {}, 'active'));
    setFilterItems(fromPRToFilterItems(data.pullRequests));

    filter.subscribe(() => {
      const filterValues: FilterDictionary = {
        searchString: filter.getFilterItemValue<string>(FilterOptions.searchString),
        repositories: filter.getFilterItemValue<string[]>(FilterOptions.repositories),
        sourceBranch: filter.getFilterItemValue<string[]>(FilterOptions.sourceBranch),
        targetBranch: filter.getFilterItemValue<string[]>(FilterOptions.targetBranch),
        author: filter.getFilterItemValue<string[]>(FilterOptions.author),
        reviewer: filter.getFilterItemValue<string[]>(FilterOptions.reviewer),
        myApprovalStatus: filter.getFilterItemValue<string[]>(FilterOptions.myApprovalStatus)
      };
      pullRequestItemProvider$.splice(0, pullRequestItemProvider$.length);
      pullRequestItemProvider$.push(...applyFilter(data.pullRequests, filterValues, 'active'));
    }, FILTER_CHANGE_EVENT);
    return () => filter.unsubscribe(() => {}, FILTER_CHANGE_EVENT);
  }, [filter, data.pullRequests]);

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
