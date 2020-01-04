import '@testing-library/jest-dom/extend-expect';
import { PR } from '../state/types';
import {
  filterByTitle,
  filterByRepositoryId,
  filterBySourceBranchDisplayName,
  filterByTargetBranchDisplayName,
  filterByCreatedByUserId,
  filterByReviewers,
  filterByApprovalStatus,
  filterByDraftStatus,
  applyFilter,
  filterByActiveStatus,
  filterByCompletedStatus,
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
    expect(filterByTitle(pullRequest, ['Title'])).toBeTruthy();
    expect(filterByTitle(pullRequest, ['Not'])).toBeFalsy();
  });

  test('filterByRepositoryId()', () => {
    const pullRequest: PR = {
      repositoryId: '1',
    } as PR;
    expect(filterByRepositoryId(pullRequest, ['1'])).toBeTruthy();
    expect(filterByRepositoryId(pullRequest, ['2'])).toBeFalsy();
  });

  test('filterBySourceBranchDisplayName()', () => {
    const pullRequest: PR = {
      sourceBranch: {
        name: 'Source Branch',
      },
    } as PR;
    expect(filterBySourceBranchDisplayName(pullRequest, ['Source Branch'])).toBeTruthy();
    expect(filterBySourceBranchDisplayName(pullRequest, ['Target Branch'])).toBeFalsy();
  });

  test('filterByTargetBranchDisplayName()', () => {
    const pullRequest: PR = {
      targetBranch: {
        name: 'Target Branch',
      },
    } as PR;
    expect(filterByTargetBranchDisplayName(pullRequest, ['Target Branch'])).toBeTruthy();
    expect(filterByTargetBranchDisplayName(pullRequest, ['Source Branch'])).toBeFalsy();
  });

  test('filterByCreatedByUserId()', () => {
    const pullRequest: PR = {
      createdBy: {
        id: '1',
      },
    } as PR;
    expect(filterByCreatedByUserId(pullRequest, ['1'])).toBeTruthy();
    expect(filterByCreatedByUserId(pullRequest, ['2'])).toBeFalsy();
  });

  test('filterByReviewers()', () => {
    const pullRequest: PR = {
      reviewers: [{ id: '1' }],
    } as PR;
    expect(filterByReviewers(pullRequest, ['1'])).toBeTruthy();
    expect(filterByReviewers(pullRequest, ['2'])).toBeFalsy();
  });

  test('filterByApprovalStatus()', () => {
    const pullRequest: PR = {
      myApprovalStatus: '10',
    } as PR;
    expect(filterByApprovalStatus(pullRequest, ['10'])).toBeTruthy();
    expect(filterByApprovalStatus(pullRequest, ['5'])).toBeFalsy();
  });

  test('filterByDraftStatus()', () => {
    expect(filterByDraftStatus({ isDraft: true } as PR)).toBeTruthy();
    expect(filterByDraftStatus({ isDraft: false } as PR)).toBeFalsy();
  });

  test('filterByActiveStatus()', () => {
    expect(filterByActiveStatus({ isActive: true, isDraft: false } as PR)).toBeTruthy();
    expect(filterByActiveStatus({ isActive: false, isDraft: true } as PR)).toBeFalsy();
  });

  test('filterByCompletedStatus()', () => {
    expect(filterByCompletedStatus({ isCompleted: true } as PR)).toBeTruthy();
    expect(filterByCompletedStatus({ isCompleted: false } as PR)).toBeFalsy();
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
    const filteredPullRequests = applyFilter(pullRequests, { searchString: 'Hello World' }, 'active');
    expect(filteredPullRequests.length).toBe(1);
  });
});
