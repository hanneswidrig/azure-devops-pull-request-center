import '@testing-library/jest-dom/extend-expect';
import { GitRepository } from 'azure-devops-extension-api/Git/Git';
import { IdentityRef } from 'azure-devops-extension-api/WebApi/WebApi';

import { PR } from '../state/types';
import { ReviewerVoteLabel } from '../lib/enums';
import { sortByRepositoryName, sortByDisplayName, getVoteDescription, sortByCreationDate } from '../lib/utils';

describe('Utilities', () => {
  test('sortByCreationDate()', () => {
    const oldDate = new Date(2021, 0, 1);
    const middleDate = new Date(2021, 4, 12);
    const newDate = new Date(2021, 9, 1);
    const pullRequests: PR[] = [{ creationDate: middleDate }, { creationDate: oldDate }, { creationDate: newDate }] as PR[];

    expect(pullRequests.sort((a, b) => sortByCreationDate(a, b, 'desc'))).toEqual([
      { creationDate: newDate },
      { creationDate: middleDate },
      { creationDate: oldDate },
    ] as PR[]);

    expect(pullRequests.sort((a, b) => sortByCreationDate(a, b, 'asc'))).toEqual([
      { creationDate: oldDate },
      { creationDate: middleDate },
      { creationDate: newDate },
    ] as PR[]);
  });

  test('sortByRepositoryName()', () => {
    const repositories: GitRepository[] = [{ name: 'B' }, { name: 'A' }] as GitRepository[];
    const sortedRepositories = repositories.sort(sortByRepositoryName);
    expect(sortedRepositories[0].name).toBe('A');
  });

  test('sortByDisplayName()', () => {
    const users: IdentityRef[] = [{ displayName: 'B' }, { displayName: 'A' }] as IdentityRef[];
    const sortedUsers = users.sort(sortByDisplayName);
    expect(sortedUsers[0].displayName).toBe('A');
  });

  test('getVoteDescription()', () => {
    const voteDescription = getVoteDescription(10);
    expect(voteDescription).toBe(ReviewerVoteLabel.Approved);
  });
});
