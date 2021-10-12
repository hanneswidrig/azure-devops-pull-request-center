import React from 'react';
import { Dispatch } from 'redux';
import { useDispatch } from 'react-redux';

import { Page } from 'azure-devops-ui/Page';
import { Surface } from 'azure-devops-ui/Surface';
import { TabBar, Tab, TabSize } from 'azure-devops-ui/Tabs';
import { IHeaderCommandBarItem, HeaderCommandBar } from 'azure-devops-ui/HeaderCommandBar';
import { CustomHeader, HeaderTitleArea, HeaderTitleRow, HeaderTitle } from 'azure-devops-ui/Header';

import { useTypedSelector } from '../lib/utils';
import { SettingsPanel } from '../components/SettingsPanel';
import { PrHubState, PR, TabOptions } from '../state/types';
import { useRefreshTicker } from '../hooks/useRefreshTicker';
import { Active, Draft, RecentlyCompleted } from './ClassicTab';
import { setSelectedTab, setPullRequests, toggleSettingsPanel } from '../state/actions';

const commandBarItems = (dispatch: Dispatch<any>, store: PrHubState, timeUntil: string): IHeaderCommandBarItem[] => {
  return [
    {
      id: 'refresh',
      text: store.settings.autoRefreshDuration !== 'off' ? `Auto Refreshing (${timeUntil})` : 'Refresh',
      isPrimary: true,
      important: true,
      onActivate: () => {
        dispatch(setPullRequests());
      },
      iconProps: { iconName: 'Refresh' },
    },
    {
      id: 'open-preferences',
      important: true,
      subtle: true,
      onActivate: () => {
        dispatch(toggleSettingsPanel());
      },
      iconProps: { iconName: 'Settings' },
    },
  ];
};

const badgeCount: (pullRequests: PR[], selectedTab: TabOptions) => number | undefined = (pullRequests: PR[], selectedTab: TabOptions) => {
  if (pullRequests.length === 0) {
    return undefined;
  }

  if (selectedTab === 'active') {
    const activePrsCount = pullRequests.filter((v) => v.isActive && !v.isDraft).length;
    return activePrsCount > 0 ? activePrsCount : undefined;
  }

  if (selectedTab === 'draft') {
    const draftPrsCount = pullRequests.filter((v) => v.isDraft).length;
    return draftPrsCount > 0 ? draftPrsCount : undefined;
  }

  if (selectedTab === 'completed') {
    const completedPrsCount = pullRequests.filter((v) => v.isCompleted).length;
    return completedPrsCount > 0 ? completedPrsCount : undefined;
  }
};

const Heading = ({ items }: { items: IHeaderCommandBarItem[] }) => {
  return (
    <CustomHeader>
      <HeaderTitleArea>
        <HeaderTitleRow>
          <HeaderTitle className="text-ellipsis" titleSize={1}>
            Pull Requests Center
          </HeaderTitle>
        </HeaderTitleRow>
      </HeaderTitleArea>
      <HeaderCommandBar items={items} />
    </CustomHeader>
  );
};

export const TabProvider = () => {
  const store = useTypedSelector((store) => store);
  const pullRequests = useTypedSelector((store) => store.data.pullRequests);
  const selectedTab = useTypedSelector((store) => store.ui.selectedTab);
  const settingsPanelOpen = useTypedSelector((store) => store.settings.settingsPanelOpen);
  const autoRefreshDuration = useTypedSelector((store) => store.settings.autoRefreshDuration);
  const { timeUntil } = useRefreshTicker(autoRefreshDuration);
  const dispatch = useDispatch();
  return (
    <Surface background={1}>
      <Page className="flex-grow">
        <Heading items={commandBarItems(dispatch, store, timeUntil)} />
        <TabBar
          selectedTabId={selectedTab}
          onSelectedTabChanged={(selectedTab) => dispatch(setSelectedTab({ selectedTab }))}
          tabSize={'tall' as TabSize}>
          <Tab name="Active" id="active" badgeCount={badgeCount(pullRequests, 'active')} />
          <Tab name="Draft" id="draft" badgeCount={badgeCount(pullRequests, 'draft')} />
          <Tab name="Recently Completed" id="completed" badgeCount={badgeCount(pullRequests, 'completed')} />
        </TabBar>
        <div className="page-content-left page-content-right page-content-top page-content-bottom">
          {selectedTab === 'active' ? <Active store={store} /> : <></>}
          {selectedTab === 'draft' ? <Draft store={store} /> : <></>}
          {selectedTab === 'completed' ? <RecentlyCompleted store={store} /> : <></>}
        </div>
      </Page>
      {settingsPanelOpen && <SettingsPanel />}
    </Surface>
  );
};
