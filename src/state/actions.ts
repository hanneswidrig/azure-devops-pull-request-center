import {
  getClient,
  IExtensionDataManager,
  IExtensionDataService,
  IGlobalMessagesService,
  IHostPageLayoutService,
  IProjectPageService,
} from 'azure-devops-extension-api';
import { GitRestClient } from 'azure-devops-extension-api/Git/GitClient';
import { CoreRestClient } from 'azure-devops-extension-api/Core/CoreClient';
import { getAccessToken, getExtensionContext, getService, getUser } from 'azure-devops-extension-sdk';
import Git, { GitPullRequestSearchCriteria, PullRequestStatus } from 'azure-devops-extension-api/Git/Git';

import { DefaultSettings, PR } from './types';
import { defaults, toPr } from './transformData';
import { sortByRepositoryName } from '../lib/utils';

interface GitRepository extends Git.GitRepository {
  isDisabled: boolean;
}

export const displayErrorMessage = async () => {
  const globalMessagesSvc = await getService<IGlobalMessagesService>('ms.vss-tfs-web.tfs-global-messages-service');
  globalMessagesSvc.addToast({ duration: 5000, message: apiErrorMessage, forceOverrideExisting: true });
};

export const criteria = (status: PullRequestStatus): GitPullRequestSearchCriteria => {
  return {
    repositoryId: '',
    creatorId: '',
    includeLinks: true,
    reviewerId: '',
    sourceRefName: '',
    sourceRepositoryId: '',
    status: status,
    targetRefName: '',
  };
};

export const apiErrorMessage = 'An error occurred while fetching pull requests. Please reload or refresh the page.';
export const coreClient = getClient<CoreRestClient>(CoreRestClient);
export const gitClient = getClient<GitRestClient>(GitRestClient);

export const getLayoutService = async (): Promise<IHostPageLayoutService> => {
  return getService<IHostPageLayoutService>('ms.vss-features.host-page-layout-service');
};

export const getDataManagementContext = async (): Promise<IExtensionDataManager> => {
  const extensionId = getExtensionContext().id;
  const accessToken = await getAccessToken();
  const extensionDataService = await getService<IExtensionDataService>('ms.vss-features.extension-data-service');
  return extensionDataService.getExtensionDataManager(extensionId, accessToken);
};

export const setFullScreenModeState = async (isFullScreenMode: boolean): Promise<boolean> => {
  const layoutService = await getLayoutService();
  layoutService.setFullScreenMode(isFullScreenMode);
  return isFullScreenMode;
};

export const getRepositories = async () => {
  const projectService = await getService<IProjectPageService>('ms.vss-tfs-web.tfs-page-data-service');
  const currentProject = await projectService.getProject();
  const repositories = (await gitClient.getRepositories(currentProject?.id)) as GitRepository[];
  return repositories.sort(sortByRepositoryName).filter(({ isDisabled }) => !isDisabled);
};

export const getSettings = async (): Promise<DefaultSettings | null> => {
  const userContext = getUser();
  const key = `prc-ext-data-default-${userContext.id}`;
  const context = await getDataManagementContext();
  return context.getValue(key, { defaultValue: null });
};

export const setSettings = async (defaultSettings: DefaultSettings): Promise<DefaultSettings> => {
  const userContext = getUser();
  const key = `prc-ext-data-default-${userContext.id}`;
  const value: DefaultSettings = {
    ...defaultSettings,
    selectedFilterOptions: defaultSettings.isSavingFilterOptions ? defaultSettings.selectedFilterOptions : defaults().selectedFilterOptions,
  };

  const context = await getDataManagementContext();
  await context.setValue(key, value);
  return value;
};

export async function fetchPullRequests(repository: GitRepository, criteria: GitPullRequestSearchCriteria, take: number): Promise<PR[]> {
  if (take <= 0) {
    return [];
  }

  let skip = 0;
  const userContext = getUser();
  const pullRequests: PR[] = [];

  while (true) {
    const data = await gitClient.getPullRequests(repository.id, criteria, undefined, undefined, skip, take);
    pullRequests.push(...data.map((pr) => toPr({ pr: { ...pr, repository }, workItems: [], userContext })));
    skip += take;

    if (data.length < take) {
      return pullRequests;
    }
  }
}
