import * as React from 'react';

import { Card } from 'azure-devops-ui/Card';
import { Spinner } from 'office-ui-fabric-react';
import { Table, ITableColumn } from 'azure-devops-ui/Table';
import { ConditionalChildren } from 'azure-devops-ui/ConditionalChildren';

import './ClassicTab.scss';

import { ITab } from './TabTypes';
import { PR } from '../state/types';
import { UIFilterBar } from '../components/UIFilterBar';
import { pullRequestItemProvider$ } from './TabProvider';
import { titleColumn, reviewersColumn } from '../components/PRTableCellColumns';

export const columns: ITableColumn<PR>[] = [
  {
    id: 'title',
    name: 'Pull Request',
    renderCell: titleColumn,
    width: -100,
  },
  {
    id: 'reviewers',
    name: 'Reviewers',
    renderCell: reviewersColumn,
    width: 416,
  },
  // new ColumnMore(() => {
  //   return {
  //     id: 'sub-menu',
  //     items: [
  //       {
  //         id: 'submenu-one',
  //         text: 'Show Work Items',
  //         iconProps: { iconName: 'WorkItem' },
  //         onActivate: () => {},
  //       },
  //     ],
  //   };
  // }),
];

export const ClassicTab: React.FC<ITab> = ({ filter, filterItems, store }: ITab) => {
  return (
    <div className="flex-column">
      <ConditionalChildren renderChildren={store.ui.isFilterVisible}>
        <UIFilterBar filter={filter} filterItems={filterItems} />
      </ConditionalChildren>
      {store.data.asyncTaskCount === 0 ? (
        <Card className="flex-grow bolt-table-card" contentProps={{ contentPadding: false }}>
          <Table<PR> columns={columns} itemProvider={pullRequestItemProvider$} showLines={true} role="table" />
        </Card>
      ) : (
        <Spinner label="fetching pull requests..." size={3} className="center-spinner" />
      )}
    </div>
  );
};
