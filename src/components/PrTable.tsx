import React from 'react';

import { Card } from 'azure-devops-ui/Card';
import { Spinner } from 'office-ui-fabric-react';
import { Table, ITableColumn } from 'azure-devops-ui/Table';
import { ObservableArray } from 'azure-devops-ui/Core/Observable';

import './PrTable.scss';

import { PR } from '../state/types';
import { UiFilterBar } from './UiFilterBar';
import { useTypedSelector } from '../lib/utils';
import { EmptyDataVisual } from './EmptyDataVisual';
import { filterPullRequestsByCriteria } from '../lib/filters';
import { titleColumn, reviewersColumn } from './PRTableCellColumns';

export const pullRequestItemProvider$ = new ObservableArray<PR>();

export const columns: ITableColumn<PR>[] = [
  { id: 'title', name: 'Pull Request', renderCell: titleColumn, width: -100 },
  { id: 'reviewers', name: 'Reviewers', renderCell: reviewersColumn, width: 416 },
];

export const PrTable = () => {
  const selectedTab = useTypedSelector((store) => store.ui.selectedTab);
  const pullRequests = useTypedSelector((store) => store.data.pullRequests);
  const filterOptions = useTypedSelector((store) => store.data.filterOptions);
  const asyncTaskCount = useTypedSelector((store) => store.data.asyncTaskCount);

  React.useEffect(() => {
    pullRequestItemProvider$.removeAll();
    pullRequestItemProvider$.push(...filterPullRequestsByCriteria(pullRequests, filterOptions, selectedTab));
  }, [pullRequests, filterOptions, selectedTab]);

  return (
    <div className="flex-column">
      <UiFilterBar />
      {asyncTaskCount > 0 && <Spinner label="fetching pull requests..." size={3} className="center-spinner" />}
      {asyncTaskCount === 0 && (
        <Card className="flex-grow bolt-table-card" contentProps={{ contentPadding: false }}>
          {pullRequests.length > 0 && <Table<PR> columns={columns} itemProvider={pullRequestItemProvider$} showLines={true} role="table" />}
          {pullRequests.length === 0 && <EmptyDataVisual />}
        </Card>
      )}
    </div>
  );
};
