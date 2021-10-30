import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { GitRepository } from 'azure-devops-extension-api/Git/Git';
import { IdentityRef } from 'azure-devops-extension-api/WebApi/WebApi';

import { PR, PrHubState, SortDirection } from '../state/types';
import { ReviewerVoteLabel, ReviewerVoteNumber } from './enums';

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

export const sortByCreationDate = (a: PR, b: PR, sortDirection: SortDirection) => {
  if (sortDirection === 'desc') {
    return b.creationDate.getTime() - a.creationDate.getTime();
  }

  return a.creationDate.getTime() - b.creationDate.getTime();
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
