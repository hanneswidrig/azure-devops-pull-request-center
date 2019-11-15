import { GitRepository } from 'azure-devops-extension-api/Git/Git';
import { IdentityRef } from 'azure-devops-extension-api/WebApi/WebApi';

import { ReviewerVoteOption, ReviewerVoteLabel } from './enums';

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
  if (a.displayName! < b.displayName!) {
    return -1;
  }
  if (a.displayName! > b.displayName!) {
    return 1;
  }
  return 0;
};

export const getVoteDescription = (vote: number): string => {
  return (
    new Map<ReviewerVoteLabel | number, ReviewerVoteOption>([
      [ReviewerVoteLabel.Approved, ReviewerVoteOption['10']],
      [ReviewerVoteLabel.ApprovedWithSuggestions, ReviewerVoteOption['5']],
      [ReviewerVoteLabel.NoVote, ReviewerVoteOption['0']],
      [ReviewerVoteLabel.WaitingForAuthor, ReviewerVoteOption['-5']],
      [ReviewerVoteLabel.Rejected, ReviewerVoteOption['-10']]
    ]).get(vote) || 'No Vote'
  );
};
