import { Enum } from './typings';

export const ReviewerVoteNumber = {
  Approved: '10',
  ApprovedWithSuggestions: '5',
  NoVote: '0',
  WaitingForAuthor: '-5',
  Rejected: '-10',
  Unassigned: '-1',
} as const;
export type ReviewerVoteNumber = Enum<typeof ReviewerVoteNumber>;

export const ReviewerVoteLabel = {
  Approved: 'Approved',
  ApprovedWithSuggestions: 'With Suggestions',
  NoVote: 'Assigned',
  WaitingForAuthor: 'Waiting For Author',
  Rejected: 'Rejected',
  Unassigned: 'Unassigned',
} as const;
export type ReviewerVoteLabel = Enum<typeof ReviewerVoteLabel>;
