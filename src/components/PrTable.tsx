import React from 'react';
import { DetailsList, Persona, IColumn, PersonaSize, SelectionMode } from '@fluentui/react';

import './PrTable.css';

import { Tag } from './Tag';
import { PR } from '../state/types';
import { UiFilterBar } from './UiFilterBar';
import { applyFilters } from '../lib/filters';
import { EmptyDataVisual } from './EmptyDataVisual';
import { getReviewerVoteIconStatus } from './StatusIcon';
import { getVoteDescription, useTypedSelector } from '../lib/utils';

export const columns: IColumn[] = [
  {
    key: 'title',
    name: 'Title',
    minWidth: 200,
    maxWidth: 9999,
    isResizable: true,
    onRender: (item: PR) => (
      <div className="pr-column">
        <b>#{item.pullRequestId}</b>
        <span>{item.title}</span>
        {item.isDraft && <Tag title="Draft" type="draft"></Tag>}
        {item.isAutoComplete && <Tag title="Auto Complete" type="autoComplete"></Tag>}
        {item.hasMergeConflicts && <Tag title="Merge Conflict" type="mergeConflict"></Tag>}
      </div>
    ),
  },
  {
    key: 'author',
    name: 'Author',
    minWidth: 128,
    maxWidth: 192,
    isResizable: true,
    onRender: (item: PR) => (
      <div className="pr-column">
        <Persona className="display-block" imageUrl={item.createdBy._links['avatar'].href} size={PersonaSize.size24} />
        <span>{item.createdBy.displayName}</span>
      </div>
    ),
  },
  {
    key: 'repository',
    name: 'Repository',
    minWidth: 80,
    maxWidth: 128,
    isResizable: true,
    onRender: (item: PR) => (
      <div className="pr-column">
        <span>{item.repository.name}</span>
      </div>
    ),
  },
  {
    key: 'source-branch',
    name: 'Source Branch',
    minWidth: 92,
    maxWidth: 128,
    isResizable: true,
    onRender: (item: PR) => (
      <div className="pr-column">
        <span>{item.sourceBranch.name}</span>
      </div>
    ),
  },
  {
    key: 'target-branch',
    name: 'Target Branch',
    minWidth: 92,
    maxWidth: 128,
    isResizable: true,
    onRender: (item: PR) => (
      <div className="pr-column">
        <span>{item.targetBranch.name}</span>
      </div>
    ),
  },
  {
    key: 'date-created',
    name: 'Date Created',
    minWidth: 128,
    maxWidth: 128,
    isResizable: true,
    onRender: (item: PR) => (
      <div className="pr-column">
        <span>{item.creationDate.toLocaleString()}</span>
      </div>
    ),
  },
  {
    key: 'approval-status',
    name: 'Approval Status',
    minWidth: 104,
    maxWidth: 128,
    isResizable: true,
    onRender: (item: PR) => (
      <div className="pr-column">
        {getReviewerVoteIconStatus(item.myApprovalStatus)}
        <span>{getVoteDescription(Number(item.myApprovalStatus))}</span>
      </div>
    ),
  },
];

const List = ({ pullRequests }: { pullRequests: PR[] }) => {
  return (
    <DetailsList
      styles={{ headerWrapper: { marginTop: '-16px' } }}
      items={pullRequests}
      columns={columns}
      selectionMode={SelectionMode.none}
    />
  );
};

export const PrTable = () => {
  const pullRequests = useTypedSelector((store) =>
    applyFilters(store.data.pullRequests, store.data.filterOptions, store.ui.selectedTab, store.ui.daysAgo)
  );

  return (
    <div className="flex-column">
      <UiFilterBar />
      <div className="card-shadow">
        {pullRequests.length > 0 && <List pullRequests={pullRequests} />}
        {pullRequests.length === 0 && <EmptyDataVisual />}
      </div>
    </div>
  );
};
