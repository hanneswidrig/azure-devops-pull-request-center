import * as DevOps from 'azure-devops-extension-sdk';
import { WorkItem } from 'azure-devops-extension-api/WorkItemTracking/WorkItemTracking';
import { GitPullRequest, IdentityRefWithVote } from 'azure-devops-extension-api/Git/Git';

import { PR } from './types';
import { ReviewerVoteOption } from '../lib/enums';
import { FilterItemsDictionary } from '../tabs/Tabs.types';

type fromPullRequestToPRType = { pr: GitPullRequest; workItems: WorkItem[]; userContext: DevOps.IUserContext };
export const fromPullRequestToPR = ({ pr, workItems, userContext }: fromPullRequestToPRType) => {
  const pullRequest: PR = {
    pullRequestId: pr.pullRequestId,
    repositoryId: pr.repository.id,
    isDraft: pr.isDraft,
    isAutoComplete: pr.autoCompleteSetBy !== undefined,
    status: pr.status,
    title: pr.title,
    href: `${pr.repository.webUrl}/pullrequest/${pr.pullRequestId}`,
    createdBy: pr.createdBy,
    creationDate: pr.creationDate,
    secondaryTitle: `#${pr.pullRequestId} created by ${pr.createdBy.displayName}`,
    sourceBranch: {
      name: pr.sourceRefName.replace('refs/heads/', ''),
      href: `${pr.repository.webUrl}?version=GB${pr.sourceRefName.replace('refs/heads/', '')}`
    },
    targetBranch: {
      name: pr.targetRefName.replace('refs/heads/', ''),
      href: `${pr.repository.webUrl}?version=GB${pr.targetRefName.replace('refs/heads/', '')}`
    },
    repository: {
      href: pr.repository.webUrl,
      name: pr.repository.name
    },
    myApprovalStatus: getCurrentUserVoteStatus(pr.reviewers, userContext),
    workItems: workItems,
    reviewers: pr.reviewers
  };
  return pullRequest;
};

export const fromPRToFilterItems = (pullRequests: PR[]): FilterItemsDictionary => {
  let filterItems: FilterItemsDictionary = {
    repositories: [],
    sourceBranch: [],
    targetBranch: [],
    author: [],
    reviewer: [],
    myApprovalStatus: [
      {
        id: ReviewerVoteOption.Approved.toString(),
        text: 'Approved'
      },
      {
        id: ReviewerVoteOption.ApprovedWithSuggestions.toString(),
        text: 'Approved with suggestions'
      },
      {
        id: ReviewerVoteOption.NoVote.toString(),
        text: 'Assigned to me'
      },
      {
        id: ReviewerVoteOption.WaitingForAuthor.toString(),
        text: 'Waiting for author'
      },
      {
        id: ReviewerVoteOption.Rejected.toString(),
        text: 'Rejected'
      }
    ]
  };

  pullRequests.forEach(pr => {
    const repositoryItem = { id: pr.repositoryId, text: pr.repository.name };
    const sourceBranchItem = { id: pr.sourceBranch.name, text: pr.sourceBranch.name };
    const targetBranchItem = { id: pr.targetBranch.name, text: pr.targetBranch.name };
    const authorItem = { id: pr.createdBy.id, text: pr.createdBy.displayName };
    const reviewerItem = pr.reviewers.map(r => {
      return { id: r.id, text: r.displayName };
    });

    if (!filterItems.repositories.find(i => i.id === repositoryItem.id)) {
      filterItems.repositories.push(repositoryItem);
    }

    if (!filterItems.sourceBranch.find(i => i.id === sourceBranchItem.id)) {
      filterItems.sourceBranch.push(sourceBranchItem);
    }

    if (!filterItems.targetBranch.find(i => i.id === targetBranchItem.id)) {
      filterItems.targetBranch.push(targetBranchItem);
    }

    if (!filterItems.author.find(i => i.id === authorItem.id)) {
      filterItems.author.push(authorItem);
    }

    const newReviewers = reviewerItem.filter(r => !filterItems.reviewer.find(i => i.id === r.id));
    if (newReviewers.length > 0) {
      filterItems.reviewer.push(...newReviewers);
    }
  });

  return filterItems;
};

const getCurrentUserVoteStatus = (reviewers: IdentityRefWithVote[], userContext: DevOps.IUserContext) => {
  let voteResult = ReviewerVoteOption.NoVote;
  if (reviewers && reviewers.length > 0) {
    const currentUserReviewer = reviewers.filter(r => r.id === userContext.id);

    if (currentUserReviewer.length > 0) {
      voteResult = currentUserReviewer[0].vote as ReviewerVoteOption;
    }
  }

  return voteResult;
};
