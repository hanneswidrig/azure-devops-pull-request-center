import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, cleanup } from '@testing-library/react';
import { setIconOptions } from 'office-ui-fabric-react/lib/Styling';

import { PrHubState } from '../state/types';
import { SettingsPanel } from '../components/SettingsPanel';

afterEach(cleanup);

setIconOptions({
  disableWarnings: true,
});

jest.mock('react-redux', () => {
  return {
    useSelector: jest.fn(
      () =>
        ({
          settings: {
            defaults: {
              isFilterVisible: false,
              isFullScreenMode: false,
              selectedTab: 'active',
              sortDirection: 'desc',
            },
          },
        } as PrHubState),
    ),
    useDispatch: jest.fn(),
  };
});
jest.mock('azure-devops-extension-api', () => {
  return {
    getClient: jest.fn(),
  };
});
jest.mock('azure-devops-extension-sdk', () => jest.fn());
jest.mock('azure-devops-extension-api/Git/Git', () => {
  return {
    PullRequestStatus: {
      NotSet: 0,
      Active: 1,
      Abandoned: 2,
      Completed: 3,
      All: 4,
    },
  };
});
jest.mock('azure-devops-extension-api/Git/GitClient', () => jest.fn());
jest.mock('azure-devops-extension-api/WorkItemTracking/WorkItemTrackingClient', () => jest.fn());

describe('<SettingsPanel />', () => {
  test('renders successfully', () => {
    const { findByText } = render(<SettingsPanel />);
    expect(findByText('Extension Preferences')).toBeTruthy();
  });
});
