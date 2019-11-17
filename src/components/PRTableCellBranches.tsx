import React from 'react';
import { Button } from 'azure-devops-ui/Button';

import './PRTableCellBranches.scss';
import { PR } from '../state/types';

export const PRTableCellBranches: React.FC<{ tableItem: PR }> = ({ tableItem }: { tableItem: PR }) => {
  const sourceBranch = tableItem.sourceBranch.name.replace('refs/heads/', '');
  const targetBranch = tableItem.targetBranch.name.replace('refs/heads/', '');

  return (
    <div className='flex-row flex-center rhythm-horizontal-4'>
      <Button
        className='branch-button'
        text={tableItem.repository.name}
        iconProps={{ iconName: 'Repo' }}
        onClick={() => {
          navigator.clipboard.writeText(tableItem.repository.name);
        }}
        subtle
      />
      <Button
        className='branch-button text-ellipsis'
        text={sourceBranch}
        iconProps={{ iconName: 'BranchCompare' }}
        tooltipProps={{ text: sourceBranch, delayMs: 500 }}
        onClick={() => {
          navigator.clipboard.writeText(sourceBranch);
        }}
        subtle
      />
      <Button
        className='branch-button'
        text={targetBranch}
        iconProps={{ iconName: 'BranchMerge' }}
        onClick={() => {
          navigator.clipboard.writeText(targetBranch);
        }}
        subtle
      />
    </div>
  );
};
