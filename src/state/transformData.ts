import { IUserContext } from 'azure-devops-extension-sdk';
import { WorkItem } from 'azure-devops-extension-api/WorkItemTracking/WorkItemTracking';
import { GitPullRequest, IdentityRefWithVote } from 'azure-devops-extension-api/Git/Git';

import { FilterOptions, PR } from './types';
import { ReviewerVoteNumber, ReviewerVoteLabel } from '../lib/enums';

const getCurrentUserVoteStatus = (reviewers: IdentityRefWithVote[], userContext: IUserContext) => {
  let voteResult: ReviewerVoteNumber = ReviewerVoteNumber.NoVote;
  if (reviewers && reviewers.length > 0) {
    const currentUserReviewer = reviewers.filter((r) => r.id === userContext.id);
    if (currentUserReviewer.length > 0) {
      voteResult = currentUserReviewer[0].vote.toString() as ReviewerVoteNumber;
    }
  }

  return voteResult;
};

export const toPr = ({ pr, workItems, userContext }: { pr: GitPullRequest; workItems: WorkItem[]; userContext: IUserContext }) => {
  const pullRequest: PR = {
    pullRequestId: pr.pullRequestId,
    repositoryId: pr.repository.id,
    isDraft: pr.isDraft,
    isActive: pr.status === 1,
    isCompleted: pr.status === 3,
    isAutoComplete: pr.autoCompleteSetBy !== undefined,
    hasMergeConflicts: pr.mergeStatus === 2,
    status: pr.status,
    title: pr.title,
    href: `${pr.repository.webUrl}/pullrequest/${pr.pullRequestId}`,
    createdBy: pr.createdBy,
    creationDate: pr.creationDate,
    secondaryTitle: `#${pr.pullRequestId} created by ${pr.createdBy.displayName}`,
    sourceBranch: {
      name: pr.sourceRefName.replace('refs/heads/', ''),
      href: `${pr.repository.webUrl}?version=GB${pr.sourceRefName.replace('refs/heads/', '')}`,
    },
    targetBranch: {
      name: pr.targetRefName.replace('refs/heads/', ''),
      href: `${pr.repository.webUrl}?version=GB${pr.targetRefName.replace('refs/heads/', '')}`,
    },
    repository: {
      href: pr.repository.webUrl,
      name: pr.repository.name,
    },
    myApprovalStatus: getCurrentUserVoteStatus(pr.reviewers, userContext),
    workItems: workItems,
    reviewers: pr.reviewers,
  };
  return pullRequest;
};

export const toFilterItems = (pullRequests: PR[]): FilterOptions => {
  const filterItems: FilterOptions = {
    searchString: [],
    repositories: [],
    sourceBranch: [],
    targetBranch: [],
    author: [],
    reviewer: [],
    myApprovalStatus: [
      { label: ReviewerVoteLabel.Approved, value: ReviewerVoteNumber.Approved },
      { label: ReviewerVoteLabel.ApprovedWithSuggestions, value: ReviewerVoteNumber.ApprovedWithSuggestions },
      { label: ReviewerVoteLabel.NoVote, value: ReviewerVoteNumber.NoVote },
      { label: ReviewerVoteLabel.WaitingForAuthor, value: ReviewerVoteNumber.WaitingForAuthor },
      { label: ReviewerVoteLabel.Rejected, value: ReviewerVoteNumber.Rejected },
    ],
  };

  pullRequests.forEach((pr) => {
    const repositoryItem = { label: pr.repository.name, value: pr.repositoryId };
    const sourceBranchItem = { label: pr.sourceBranch.name, value: pr.sourceBranch.name };
    const targetBranchItem = { label: pr.targetBranch.name, value: pr.targetBranch.name };
    const authorItem = { label: pr.createdBy.displayName, value: pr.createdBy.id };
    const reviewerItem = pr.reviewers.map((r) => ({ label: r.displayName, value: r.id }));

    if (!filterItems.repositories.find((i) => i.value === repositoryItem.value)) {
      filterItems.repositories.push(repositoryItem);
    }

    if (!filterItems.sourceBranch.find((i) => i.value === sourceBranchItem.value)) {
      filterItems.sourceBranch.push(sourceBranchItem);
    }

    if (!filterItems.targetBranch.find((i) => i.value === targetBranchItem.value)) {
      filterItems.targetBranch.push(targetBranchItem);
    }

    if (!filterItems.author.find((i) => i.value === authorItem.value)) {
      filterItems.author.push(authorItem);
    }

    const newReviewers = reviewerItem.filter((r) => !filterItems.reviewer.find((i) => i.value === r.value));
    if (newReviewers.length > 0) {
      filterItems.reviewer.push(...newReviewers);
    }
  });

  return filterItems;
};
