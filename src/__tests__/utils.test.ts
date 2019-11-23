import '@testing-library/jest-dom/extend-expect';
import { GitRepository } from 'azure-devops-extension-api/Git/Git';
import { IdentityRef } from 'azure-devops-extension-api/WebApi/WebApi';
import { sortByRepositoryName, sortByDisplayName, getVoteDescription } from '../lib/utils';
import { ReviewerVoteLabel } from '../lib/enums';

describe('Utilities', () => {
  test('sortByRepositoryName()', () => {
    const repositories: GitRepository[] = [
      {
        name: 'B',
      },
      {
        name: 'A',
      },
    ] as GitRepository[];
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
