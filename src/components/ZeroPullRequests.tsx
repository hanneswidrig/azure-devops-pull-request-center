import React from 'react';
import { ZeroData } from 'azure-devops-ui/ZeroData';

type Props = { refreshFunc: () => Promise<void> };
export const ZeroPullRequests: React.FC<Props> = ({ refreshFunc }: Props) => {
  return (
    <ZeroData
      primaryText='No active pull requests for this view.'
      imageAltText='No active pull requests for this view.'
      imagePath={require('../images/emptyPRList.png')}
      actionText='Refresh'
      actionType={0}
      onActionClick={refreshFunc}
    />
  );
};
