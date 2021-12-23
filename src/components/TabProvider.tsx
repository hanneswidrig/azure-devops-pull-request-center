import React from 'react';
import { Dispatch } from 'redux';
import { useDispatch } from 'react-redux';

import { Page } from 'azure-devops-ui/Page';
import { Surface } from 'azure-devops-ui/Surface';
import { TabBar, Tab, TabSize } from 'azure-devops-ui/Tabs';
import { ComboBox, IComboBoxOption, Spinner } from '@fluentui/react';
import { IHeaderCommandBarItem, HeaderCommandBar } from 'azure-devops-ui/HeaderCommandBar';
import { CustomHeader, HeaderTitleArea, HeaderTitleRow, HeaderTitle } from 'azure-devops-ui/Header';

import './TabProvider.css';

import { PrTable } from './PrTable';
import { SettingsPanel } from './SettingsPanel';
import { useRefreshTicker } from '../hooks/useRefreshTicker';
import { PrHubState, PR, TabOptions, DaysAgo } from '../state/types';
import { filterByCreationDate, useTypedSelector } from '../lib/utils';
import { setSelectedTab, setPullRequests, toggleSettingsPanel, toggleSortDirection, setDaysAgo } from '../state/actions';

const commandBarItems = (dispatch: Dispatch<any>, store: PrHubState, timeUntil: string): IHeaderCommandBarItem[] => {
  return [
    {
      id: 'sort-direction',
      text: store.ui.sortDirection === 'desc' ? 'Newest' : 'Oldest',
      tooltipProps: {
        text: 'Sorting by',
        delayMs: 1000,
      },
      important: true,
      subtle: true,
      onActivate: () => {
        dispatch(toggleSortDirection());
      },
      iconProps: {
        iconName: store.ui.sortDirection === 'desc' ? 'SortDown' : 'SortUp',
      },
    },
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
          <HeaderTitle titleSize={1}>Pull Requests Center</HeaderTitle>
        </HeaderTitleRow>
      </HeaderTitleArea>
      <HeaderCommandBar items={items} />
    </CustomHeader>
  );
};

const daysAgoOptions: IComboBoxOption[] = [
  { key: '7', text: '7 Days' },
  { key: '14', text: '14 Days' },
  { key: '30', text: '1 Month' },
  { key: '90', text: '3 Months' },
  { key: '180', text: '6 Months' },
  { key: '365', text: '12 Months' },
  { key: '-1', text: 'All Time' },
];

export const TabProvider = () => {
  const store = useTypedSelector((store) => store);
  const daysAgo = useTypedSelector((store) => store.ui.daysAgo);
  const selectedTab = useTypedSelector((store) => store.ui.selectedTab);
  const asyncTaskCount = useTypedSelector((store) => store.data.asyncTaskCount);
  const pullRequests = useTypedSelector((store) =>
    store.data.pullRequests.filter((pullRequest) => filterByCreationDate(pullRequest, store.ui.daysAgo))
  );
  const settingsPanelOpen = useTypedSelector((store) => store.settings.settingsPanelOpen);
  const autoRefreshDuration = useTypedSelector((store) => store.settings.autoRefreshDuration);

  const { timeUntil } = useRefreshTicker(autoRefreshDuration);
  const dispatch = useDispatch();

  return (
    <Surface background={1}>
      <Page className="page">
        <Heading items={commandBarItems(dispatch, store, timeUntil)} />
        {asyncTaskCount > 0 && <Spinner label="fetching pull requests..." size={3} className="center-spinner" />}
        {asyncTaskCount === 0 && (
          <React.Fragment>
            <TabBar
              tabsClassName="tab-bar"
              selectedTabId={selectedTab}
              onSelectedTabChanged={(selectedTab) => dispatch(setSelectedTab({ selectedTab }))}
              tabSize={'compact' as TabSize}>
              <Tab name="Active" id="active" badgeCount={badgeCount(pullRequests, 'active')} />
              <Tab name="Draft" id="draft" badgeCount={badgeCount(pullRequests, 'draft')} />
              <Tab name="Recently Completed" id="completed" badgeCount={badgeCount(pullRequests, 'completed')} />
              <div className="days-ago">
                <i className="days-ago-label">Displaying PRs more recent than</i>
                <ComboBox
                  styles={{ root: { width: '8rem' } }}
                  options={daysAgoOptions}
                  selectedKey={daysAgoOptions.find(({ key }) => key === daysAgo)?.key}
                  onChange={(_, selectedOption) => dispatch(setDaysAgo({ daysAgo: selectedOption?.key as DaysAgo }))}
                />
              </div>
            </TabBar>
            <div className="page-content-left page-content-right page-content-top page-content-bottom">
              <PrTable />
            </div>
          </React.Fragment>
        )}
      </Page>
      {settingsPanelOpen && <SettingsPanel />}
    </Surface>
  );
};
