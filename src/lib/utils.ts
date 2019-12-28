import { useEffect, useRef } from 'react';
import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { GitRepository } from 'azure-devops-extension-api/Git/Git';
import { IdentityRef } from 'azure-devops-extension-api/WebApi/WebApi';

import { ActiveItemProvider } from '../tabs/TabTypes';
import { PrHubState, PR, SortDirection } from '../state/types';
import { ReviewerVoteNumber, ReviewerVoteLabel } from './enums';

export const sortByRepositoryName = (a: GitRepository, b: GitRepository) => {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  return 0;
};

export const sortByDisplayName = (a: IdentityRef, b: IdentityRef) => {
  if (a.displayName < b.displayName) {
    return -1;
  }
  if (a.displayName > b.displayName) {
    return 1;
  }
  return 0;
};

export const sortByPullRequestId = (a: ActiveItemProvider, b: ActiveItemProvider, sortDirection: SortDirection) => {
  return sortDirection === 'desc'
    ? (b as PR).pullRequestId - (a as PR).pullRequestId
    : (a as PR).pullRequestId - (b as PR).pullRequestId;
};

export const getVoteDescription = (vote: number): string => {
  const votes: Record<string, string> = {
    [ReviewerVoteNumber.Approved]: ReviewerVoteLabel.Approved,
    [ReviewerVoteNumber.ApprovedWithSuggestions]: ReviewerVoteLabel.ApprovedWithSuggestions,
    [ReviewerVoteNumber.NoVote]: ReviewerVoteLabel.NoVote,
    [ReviewerVoteNumber.WaitingForAuthor]: ReviewerVoteLabel.WaitingForAuthor,
    [ReviewerVoteNumber.Rejected]: ReviewerVoteLabel.Rejected,
  };
  return votes[vote.toString()];
};

export const useTypedSelector: TypedUseSelectorHook<PrHubState> = useSelector;

export const useUnmount = (fn: () => any): void => {
  const fnRef = useRef(fn);
  fnRef.current = fn;
  useEffect(() => fnRef.current(), []);
};
