import React from "react";

import { ReactComponent as Approved } from "../images/svg/approved.svg";
import { ReactComponent as ApprovedWithSuggestions } from "../images/svg/approvedWithSuggestions.svg";
import { ReactComponent as NoVote } from "../images/svg/noVote.svg";
import { ReactComponent as WaitingForAuthor } from "../images/svg/waitingForAuthor.svg";
import { ReactComponent as Rejected } from "../images/svg/rejected.svg";
import "./StatusIcon.scss";

export const getReviewerVoteIconStatus = (vote: string | number): JSX.Element => {
  const getIcon: Record<string, JSX.Element> = {
    "10": <Approved className="vote-status approved" />,
    "5": <ApprovedWithSuggestions className="vote-status approved-with-suggestions" />,
    "0": <NoVote className="vote-status no-vote" />,
    "-5": <WaitingForAuthor className="vote-status waiting" />,
    "-10": <Rejected className="vote-status rejected" />
  };
  return <div className="vote-status-container">{getIcon[vote]}</div>;
};
