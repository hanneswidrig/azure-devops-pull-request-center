import React from 'react';
import { Card } from 'azure-devops-ui/Card';
import { Table, ITableColumn } from 'azure-devops-ui/Table';
import { ObservableArray } from 'azure-devops-ui/Core/Observable';

import { PR } from '../state/types';
import { UiFilterBar } from './UiFilterBar';
import { applyFilters } from '../lib/filters';
import { useTypedSelector } from '../lib/utils';
import { EmptyDataVisual } from './EmptyDataVisual';
import { titleColumn, reviewersColumn } from './PRTableCellColumns';

export const pullRequestItemProvider$ = new ObservableArray<PR>();

export const columns: ITableColumn<PR>[] = [
  { id: 'title', name: 'Pull Request', renderCell: titleColumn, width: -100 },
  { id: 'reviewers', name: 'Reviewers', renderCell: reviewersColumn, width: 416 },
];

export const PrTable = () => {
  const selectedTab = useTypedSelector((store) => store.ui.selectedTab);
  const pullRequests = useTypedSelector((store) =>
    applyFilters(store.data.pullRequests, store.data.filterOptions, store.ui.selectedTab, store.ui.daysAgo)
  );

  React.useEffect(() => {
    pullRequestItemProvider$.removeAll();
    pullRequestItemProvider$.push(...pullRequests);
  }, [pullRequests, selectedTab]);

  return (
    <div className="flex-column">
      <UiFilterBar />
      <Card className="flex-grow bolt-table-card" contentProps={{ contentPadding: false }}>
        {pullRequests.length > 0 && <Table<PR> columns={columns} itemProvider={pullRequestItemProvider$} showLines={true} role="table" />}
        {pullRequests.length === 0 && <EmptyDataVisual />}
      </Card>
    </div>
  );
};
