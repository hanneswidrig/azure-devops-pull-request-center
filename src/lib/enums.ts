import { Enum } from './typings';

export const ReviewerVoteNumber = {
  Approved: '10',
  ApprovedWithSuggestions: '5',
  NoVote: '0',
  WaitingForAuthor: '-5',
  Rejected: '-10',
} as const;
export type ReviewerVoteNumber = Enum<typeof ReviewerVoteNumber>;

export const ReviewerVoteLabel = {
  Approved: 'Approved',
  ApprovedWithSuggestions: 'Approved with suggestions',
  NoVote: 'Assigned',
  WaitingForAuthor: 'Waiting for author',
  Rejected: 'Rejected',
} as const;
export type ReviewerVoteLabel = Enum<typeof ReviewerVoteLabel>;
