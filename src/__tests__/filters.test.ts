import '@testing-library/jest-dom/extend-expect';
import { PR } from '../state/types';
import {
  title,
  repositoryId,
  sourceBranchName,
  targetBranchName,
  createdByUserId,
  reviewers,
  approvalStatus,
  draftStatus,
  filterPullRequestsByCriteria,
  activeStatus,
  completedStatus,
} from '../lib/filters';

describe('Filters for Pull Request Table', () => {
  test('filterByTitle()', () => {
    const pullRequest: PR = {
      title: 'Title',
      pullRequestId: 1,
      repositoryId: '1',
      repository: {
        name: 'Repository',
      },
      sourceBranch: {
        name: 'Source Branch',
      },
      targetBranch: {
        name: 'Target Branch',
      },
      createdBy: {
        id: '1',
        displayName: 'Display Name',
      },
    } as PR;
    expect(title(pullRequest, ['Title'])).toBeTruthy();
    expect(title(pullRequest, ['Not'])).toBeFalsy();
  });

  test('filterByRepositoryId()', () => {
    const pullRequest: PR = {
      repositoryId: '1',
    } as PR;
    expect(repositoryId(pullRequest, ['1'])).toBeTruthy();
    expect(repositoryId(pullRequest, ['2'])).toBeFalsy();
  });

  test('filterBySourceBranchDisplayName()', () => {
    const pullRequest: PR = {
      sourceBranch: {
        name: 'Source Branch',
      },
    } as PR;
    expect(sourceBranchName(pullRequest, ['Source Branch'])).toBeTruthy();
    expect(sourceBranchName(pullRequest, ['Target Branch'])).toBeFalsy();
  });

  test('filterByTargetBranchDisplayName()', () => {
    const pullRequest: PR = {
      targetBranch: {
        name: 'Target Branch',
      },
    } as PR;
    expect(targetBranchName(pullRequest, ['Target Branch'])).toBeTruthy();
    expect(targetBranchName(pullRequest, ['Source Branch'])).toBeFalsy();
  });

  test('filterByCreatedByUserId()', () => {
    const pullRequest: PR = {
      createdBy: {
        id: '1',
      },
    } as PR;
    expect(createdByUserId(pullRequest, ['1'])).toBeTruthy();
    expect(createdByUserId(pullRequest, ['2'])).toBeFalsy();
  });

  test('filterByReviewers()', () => {
    const pullRequest: PR = {
      reviewers: [{ id: '1' }],
    } as PR;
    expect(reviewers(pullRequest, ['1'])).toBeTruthy();
    expect(reviewers(pullRequest, ['2'])).toBeFalsy();
  });

  test('filterByApprovalStatus()', () => {
    const pullRequest: PR = {
      myApprovalStatus: '10',
    } as PR;
    expect(approvalStatus(pullRequest, ['10'])).toBeTruthy();
    expect(approvalStatus(pullRequest, ['5'])).toBeFalsy();
  });

  test('filterByDraftStatus()', () => {
    expect(draftStatus({ isDraft: true } as PR)).toBeTruthy();
    expect(draftStatus({ isDraft: false } as PR)).toBeFalsy();
  });

  test('filterByActiveStatus()', () => {
    expect(activeStatus({ isActive: true, isDraft: false } as PR)).toBeTruthy();
    expect(activeStatus({ isActive: false, isDraft: true } as PR)).toBeFalsy();
  });

  test('filterByCompletedStatus()', () => {
    expect(completedStatus({ isCompleted: true } as PR)).toBeTruthy();
    expect(completedStatus({ isCompleted: false } as PR)).toBeFalsy();
  });

  test('applyFilter()', () => {
    const pullRequests: PR[] = [
      {
        title: 'Title',
        pullRequestId: 1,
        repositoryId: '1',
        repository: {
          name: 'Repository',
        },
        sourceBranch: {
          name: 'Source Branch',
        },
        targetBranch: {
          name: 'Target Branch',
        },
        createdBy: {
          id: '1',
          displayName: 'Display Name',
        },
        reviewers: [{ id: '1' }],
        myApprovalStatus: '10',
        isDraft: true,
      },
      {
        title: 'Hello World',
        pullRequestId: 1,
        repositoryId: '1',
        repository: {
          name: 'Repository',
        },
        sourceBranch: {
          name: 'Source Branch',
        },
        targetBranch: {
          name: 'Target Branch',
        },
        createdBy: {
          id: '1',
          displayName: 'Display Name',
        },
        reviewers: [{ id: '1' }],
        myApprovalStatus: '10',
        isActive: true,
        isDraft: false,
      },
    ] as PR[];
    const filteredPullRequests = filterPullRequestsByCriteria(pullRequests, { searchString: 'Hello World' }, 'active');
    expect(filteredPullRequests.length).toBe(1);
  });
});
