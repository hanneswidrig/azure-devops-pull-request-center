import React from 'react';

import { ITableColumn } from 'azure-devops-ui/Table';
import { IListBoxItem } from 'azure-devops-ui/ListBox';

import './ApprovalStatusItem.css';
import { getReviewerVoteIconStatus } from './StatusIcon';

export const ApprovalStatusItem = (
  rowIndex: number,
  columnIndex: number,
  tableColumn: ITableColumn<IListBoxItem<any>>,
  tableItem: IListBoxItem<any>
) => {
  return (
    <td key={rowIndex} className="bolt-list-box-text bolt-list-box-text-multi-select asi-container">
      {getReviewerVoteIconStatus(tableItem.id)}
      <span className="margin-left-8">{tableItem.text}</span>
    </td>
  );
};
