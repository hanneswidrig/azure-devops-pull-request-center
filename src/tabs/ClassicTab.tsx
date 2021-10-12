import React from 'react';

import { Card } from 'azure-devops-ui/Card';
import { Spinner } from 'office-ui-fabric-react';
import { Table, ITableColumn } from 'azure-devops-ui/Table';

import './ClassicTab.scss';

import { ITab } from './TabTypes';
import { PR } from '../state/types';
import { UIFilterBar } from '../components/UIFilterBar';
import { EmptyDataVisual } from '../components/EmptyDataVisual';
import { titleColumn, reviewersColumn } from '../components/PRTableCellColumns';

export const columns: ITableColumn<PR>[] = [
  { id: 'title', name: 'Pull Request', renderCell: titleColumn, width: -100 },
  { id: 'reviewers', name: 'Reviewers', renderCell: reviewersColumn, width: 416 },
];

export const ClassicTab = ({ store }: ITab) => {
  return (
    <div className="flex-column">
      <UIFilterBar />
      {store.data.asyncTaskCount === 0 ? (
        <Card className="flex-grow bolt-table-card" contentProps={{ contentPadding: false }}>
          {[].length > 0 && <Table<PR> columns={columns} showLines={true} role="table" />}
          {[].length === 0 && <EmptyDataVisual />}
        </Card>
      ) : (
        <Spinner label="fetching pull requests..." size={3} className="center-spinner" />
      )}
    </div>
  );
};

export const Active = (props: ITab) => <ClassicTab {...props} />;
export const Draft = (props: ITab) => <ClassicTab {...props} />;
export const RecentlyCompleted = (props: ITab) => <ClassicTab {...props} />;
