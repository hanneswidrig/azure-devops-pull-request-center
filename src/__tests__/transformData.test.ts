import '@testing-library/jest-dom/extend-expect';
import { IUserContext } from 'azure-devops-extension-sdk';
import { GitPullRequest, IdentityRefWithVote } from 'azure-devops-extension-api/Git/Git';

import { toPr } from '../state/transformData';

describe('transformData', () => {
  test('toPr()', () => {
    const pullRequest: GitPullRequest = {
      pullRequestId: 1,
      repository: {
        id: 'repositoryId',
        name: 'repository',
        webUrl: 'https://repository.com',
      },
      isDraft: true,
      autoCompleteSetBy: {},
      mergeStatus: 2,
      status: 1,
      title: 'Title',
      createdBy: { displayName: 'createdBy' },
      creationDate: new Date(2019, 1, 1),
      sourceRefName: 'refs/heads/sourceBranch',
      targetRefName: 'refs/heads/targetBranch',
      reviewers: [] as IdentityRefWithVote[],
    } as GitPullRequest;
    const userContext: IUserContext = {
      id: '1',
      descriptor: 'descriptor',
      displayName: 'Full Name',
      name: 'Name',
      imageUrl: 'https://image.com',
    };
    const transformedPR = toPr({
      pr: pullRequest,
      workItems: [],
      userContext: userContext,
    });

    expect(transformedPR.pullRequestId).toBe(1);
    expect(transformedPR.repositoryId).toBe('repositoryId');
    expect(transformedPR.isDraft).toBe(true);
    expect(transformedPR.isAutoComplete).toBe(true);
    expect(transformedPR.hasMergeConflicts).toBe(true);
    expect(transformedPR.status).toBe(1);
    expect(transformedPR.title).toBe('Title');
    expect(transformedPR.href).toBe('https://repository.com/pullrequest/1');
    expect(transformedPR.createdBy.displayName).toBe('createdBy');
    expect(transformedPR.creationDate.toISOString()).toBe(new Date(2019, 1, 1).toISOString());
    expect(transformedPR.secondaryTitle).toBe('#1 created by createdBy');
    expect(transformedPR.sourceBranch.name).toBe('sourceBranch');
    expect(transformedPR.sourceBranch.href).toBe('https://repository.com?version=GBsourceBranch');
    expect(transformedPR.targetBranch.name).toBe('targetBranch');
    expect(transformedPR.targetBranch.href).toBe('https://repository.com?version=GBtargetBranch');
    expect(transformedPR.repository.name).toBe('repository');
    expect(transformedPR.repository.href).toBe('https://repository.com');
    expect(transformedPR.myApprovalStatus).toBe('-1');
    expect(transformedPR.workItems.length).toBe(0);
    expect(transformedPR.reviewers.length).toBe(0);
  });
});
