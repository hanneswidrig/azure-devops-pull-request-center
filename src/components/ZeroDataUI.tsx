import React from "react";
import { ZeroData, ZeroDataActionType } from "azure-devops-ui/ZeroData";

interface ZeroDataUIProps {
  refreshFunc: () => Promise<void>;
}
export const ZeroDataUI: React.FC<ZeroDataUIProps> = ({ refreshFunc }: ZeroDataUIProps) => {
  return (
    <ZeroData
      primaryText="No active pull requests for this view."
      imageAltText="No active pull requests for this view."
      imagePath={require("../images/emptyPRList.png")}
      actionText="Refresh"
      // @ts-ignore
      actionType={ZeroDataActionType.ctaButton}
      onActionClick={refreshFunc}
    />
  );
};
