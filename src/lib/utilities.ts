import { GitRepository } from 'azure-devops-extension-api/Git/Git';
import { IdentityRef } from 'azure-devops-extension-api/WebApi/WebApi';

import { ReviewerVoteOption } from './enums';

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
  const voteOption = new Map<number, string>([
    [ReviewerVoteOption.Approved, 'Approved'],
    [ReviewerVoteOption.ApprovedWithSuggestions, 'Approved with Suggestions'],
    [ReviewerVoteOption.NoVote, 'No Vote'],
    [ReviewerVoteOption.WaitingForAuthor, 'Waiting for Author'],
    [ReviewerVoteOption.Rejected, 'Rejected']
  ]);
  return voteOption.get(vote) || 'No Vote';
};
