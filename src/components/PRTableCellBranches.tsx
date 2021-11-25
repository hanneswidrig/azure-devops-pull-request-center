import React from 'react';
import { Button } from 'azure-devops-ui/Button';

import './PRTableCellBranches.css';
import { PR } from '../state/types';

type Props = { tableItem: PR };
export const PRTableCellBranches = ({ tableItem }: Props) => {
  const sourceBranch = tableItem.sourceBranch.name.replace('refs/heads/', '');
  const targetBranch = tableItem.targetBranch.name.replace('refs/heads/', '');

  return (
    <div className="flex-row flex-center rhythm-horizontal-4">
      <Button className="branch-button" text={tableItem.repository.name} iconProps={{ iconName: 'Repo' }} subtle />
      <Button
        className="branch-button text-ellipsis"
        text={sourceBranch}
        iconProps={{ iconName: 'BranchCompare' }}
        tooltipProps={{ text: sourceBranch, delayMs: 500 }}
        subtle
      />
      <Button className="branch-button" text={targetBranch} iconProps={{ iconName: 'BranchMerge' }} subtle />
    </div>
  );
};
