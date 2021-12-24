import { compareAsc, compareDesc, isAfter, subDays } from 'date-fns';
import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { GitRepository } from 'azure-devops-extension-api/Git/Git';
import { IdentityRef } from 'azure-devops-extension-api/WebApi/WebApi';

import { DaysAgo, PR, PrHubState, SortDirection } from '../state/types';
import { ReviewerVoteLabel, ReviewerVoteNumber } from './enums';

export const sortByRepositoryName = (a: GitRepository, b: GitRepository): number => {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  return 0;
};

export const sortByDisplayName = (a: IdentityRef, b: IdentityRef): number => {
  if (a.displayName < b.displayName) {
    return -1;
  }
  if (a.displayName > b.displayName) {
    return 1;
  }
  return 0;
};

export const sortByCreationDate = (a: PR, b: PR, sortDirection: SortDirection): number => {
  return sortDirection === 'desc' ? compareDesc(a.creationDate, b.creationDate) : compareAsc(a.creationDate, b.creationDate);
};

export const filterByCreationDate = (pullRequest: PR, daysAgo: DaysAgo): boolean => {
  if (daysAgo === '-1') {
    return true;
  }

  const minimumDate = subDays(new Date(), Number(daysAgo));
  return isAfter(pullRequest.creationDate, minimumDate);
};

export const getVoteDescription = (vote: number): string => {
  const votes: Record<string, string> = {
    [ReviewerVoteNumber.Approved]: ReviewerVoteLabel.Approved,
    [ReviewerVoteNumber.ApprovedWithSuggestions]: ReviewerVoteLabel.ApprovedWithSuggestions,
    [ReviewerVoteNumber.NoVote]: ReviewerVoteLabel.NoVote,
    [ReviewerVoteNumber.WaitingForAuthor]: ReviewerVoteLabel.WaitingForAuthor,
    [ReviewerVoteNumber.Rejected]: ReviewerVoteLabel.Rejected,
    [ReviewerVoteNumber.Unassigned]: ReviewerVoteLabel.Unassigned,
  };
  return votes[vote.toString()];
};

export const useTypedSelector: TypedUseSelectorHook<PrHubState> = useSelector;
