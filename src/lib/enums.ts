import { Enum } from './typings';

export const ReviewerVoteLabel = {
  Approved: '10',
  ApprovedWithSuggestions: '5',
  NoVote: '0',
  WaitingForAuthor: '-5',
  Rejected: '-10'
} as const;
export type ReviewerVoteLabel = Enum<typeof ReviewerVoteLabel>;

export const ReviewerVoteOption = {
  '10': 'Approved',
  '5': 'ApprovedWithSuggestions',
  '0': 'NoVote',
  '-5': 'WaitingForAuthor',
  '-10': 'Rejected'
} as const;
export type ReviewerVoteOption = Enum<typeof ReviewerVoteOption>;
