import * as React from 'react';

import { Card } from 'azure-devops-ui/Card';
import { Table } from 'azure-devops-ui/Table';
import { Spinner } from 'office-ui-fabric-react';
import { ConditionalChildren } from 'azure-devops-ui/ConditionalChildren';

import './ClassicTab.scss';

import { ITab } from './TabTypes';
import { PR } from '../state/types';
import { UIFilterBar } from '../components/UIFilterBar';
import { pullRequestItemProvider$, columns } from './TabProvider';

export const ClassicTab: React.FC<ITab> = ({ filter, filterItems, store }) => {
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
