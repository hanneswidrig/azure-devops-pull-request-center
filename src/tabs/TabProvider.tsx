import * as React from 'react';
import { Dispatch } from 'redux';
import { useDispatch } from 'react-redux';

import { Draft } from './Draft';
import { Active } from './Active';
import { Page } from 'azure-devops-ui/Page';
import { Surface } from 'azure-devops-ui/Surface';
import { TabBar, Tab } from 'azure-devops-ui/Tabs';
import { RecentlyCompleted } from './RecentlyCompleted';
import { ObservableArray } from 'azure-devops-ui/Core/Observable';
import { FILTER_CHANGE_EVENT, Filter } from 'azure-devops-ui/Utilities/Filter';
import { CustomHeader, HeaderTitleArea, HeaderTitleRow, HeaderTitle } from 'azure-devops-ui/Header';
import { IHeaderCommandBarItem, HeaderCommandBarWithFilter, HeaderCommandBar } from 'azure-devops-ui/HeaderCommandBar';

import { filter } from '..';
import { applyFilter } from '../lib/filters';
import { useUpdates } from '../hooks/useUpdates';
import { useUnmount, useTypedSelector } from '../lib/utils';
import { SettingsPanel } from '../components/SettingsPanel';
import { PrHubState, PR, TabOptions } from '../state/types';
import { fromPRToFilterItems } from '../state/transformData';
import { useRefreshTicker } from '../hooks/useRefreshTicker';
import {
  setSelectedTab,
  setPullRequests,
  toggleSettingsPanel,
  toggleSortDirection,
  triggerSortDirection,
} from '../state/actions';
import { ITab, ActiveItemProvider, FilterItemsDictionary, FilterDictionary, FilterOptions } from './TabTypes';

export const getCurrentFilterValues: (filter: Filter) => FilterDictionary = filter => {
  return {
    searchString: filter.getFilterItemValue<string>(FilterOptions.searchString),
    repositories: filter.getFilterItemValue<string[]>(FilterOptions.repositories),
    sourceBranch: filter.getFilterItemValue<string[]>(FilterOptions.sourceBranch),
    targetBranch: filter.getFilterItemValue<string[]>(FilterOptions.targetBranch),
    author: filter.getFilterItemValue<string[]>(FilterOptions.author),
    reviewer: filter.getFilterItemValue<string[]>(FilterOptions.reviewer),
    myApprovalStatus: filter.getFilterItemValue<string[]>(FilterOptions.myApprovalStatus),
  };
};

const setCurrentFilterValues = (filter: Filter, savedFilterItems: FilterDictionary | undefined) => {
  filter.setState({
    [FilterOptions.searchString]: { value: savedFilterItems?.searchString },
    [FilterOptions.repositories]: { value: savedFilterItems?.repositories },
    [FilterOptions.sourceBranch]: { value: savedFilterItems?.sourceBranch },
    [FilterOptions.targetBranch]: { value: savedFilterItems?.targetBranch },
    [FilterOptions.author]: { value: savedFilterItems?.author },
    [FilterOptions.reviewer]: { value: savedFilterItems?.reviewer },
    [FilterOptions.myApprovalStatus]: { value: savedFilterItems?.myApprovalStatus },
  });
};

const onFilterChanges = (store: PrHubState) => {
  filter.subscribe(() => {
    if (store.data.pullRequests.length > 0) {
      pullRequestItemProvider$.splice(0, pullRequestItemProvider$.length);
      pullRequestItemProvider$.push(
        ...applyFilter(store.data.pullRequests, getCurrentFilterValues(filter), store.ui.selectedTab),
      );
      triggerSortDirection();
    }
  }, FILTER_CHANGE_EVENT);
};

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
      id: 'open-prefs',
      important: true,
      subtle: true,
      onActivate: () => {
        dispatch(toggleSettingsPanel());
      },
      iconProps: { iconName: 'Settings' },
    },
  ];
};

const getFilterCommandBarItems = (dispatch: Dispatch<any>, store: PrHubState): IHeaderCommandBarItem[] => {
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
  ];
};

const getPageContent = ({ newSelectedTab, filterItems, store }: { newSelectedTab: TabOptions } & ITab) => {
  const tabs: Record<TabOptions, JSX.Element> = {
    active: <Active filterItems={filterItems} store={store} />,
    draft: <Draft filterItems={filterItems} store={store} />,
    completed: <RecentlyCompleted filterItems={filterItems} store={store} />,
  };
  return tabs[newSelectedTab];
};

const badgeCount: (pullRequests: PR[], selectedTab: TabOptions) => number | undefined = (
  pullRequests: PR[],
  selectedTab: TabOptions,
) => {
  if (pullRequests.length === 0) {
    return undefined;
  }

  if (selectedTab === 'active') {
    const activePrsCount = pullRequests.filter(v => v.isActive && !v.isDraft).length;
    return activePrsCount > 0 ? activePrsCount : undefined;
  }

  if (selectedTab === 'draft') {
    const draftPrsCount = pullRequests.filter(v => v.isDraft).length;
    return draftPrsCount > 0 ? draftPrsCount : undefined;
  }

  if (selectedTab === 'completed') {
    const completedPrsCount = pullRequests.filter(v => v.isCompleted).length;
    return completedPrsCount > 0 ? completedPrsCount : undefined;
  }
};

export const pullRequestItemProvider$ = new ObservableArray<ActiveItemProvider>();
export const TabProvider: React.FC = () => {
  const store = useTypedSelector(store => store);
  const selectedTab = useTypedSelector(store => store.ui.selectedTab);
  const dispatch = useDispatch();

  const [filterItems, setFilterItems] = React.useState<FilterItemsDictionary>({
    repositories: [],
    sourceBranch: [],
    targetBranch: [],
    author: [],
    reviewer: [],
    myApprovalStatus: [],
  });
  const { timeUntil } = useRefreshTicker(store.settings.autoRefreshDuration);
  useUpdates();
  onFilterChanges(store);

  React.useEffect(() => {
    if (store.data.pullRequests.length > 0) {
      pullRequestItemProvider$.splice(0, pullRequestItemProvider$.length);
      pullRequestItemProvider$.push(
        ...applyFilter(store.data.pullRequests, getCurrentFilterValues(filter), selectedTab),
      );
      setFilterItems(
        fromPRToFilterItems(applyFilter(store.data.pullRequests, getCurrentFilterValues(filter), selectedTab)),
      );
      setCurrentFilterValues(filter, store.settings.defaults.filterValues);
      triggerSortDirection();
    }
  }, [store.data.pullRequests, selectedTab, store.settings.defaults.filterValues, dispatch]);

  useUnmount(() => {
    filter.unsubscribe(() => ({}), FILTER_CHANGE_EVENT);
  });

  return (
    <Surface background={1}>
      <Page className="azure-pull-request-hub flex-grow">
        <CustomHeader>
          <HeaderTitleArea>
            <HeaderTitleRow>
              <HeaderTitle className="text-ellipsis" titleSize={1}>
                Pull Requests Center
              </HeaderTitle>
            </HeaderTitleRow>
          </HeaderTitleArea>
          {/* {store.settings.autoRefreshDuration !== 'off' && (
            <DefaultButton
              iconProps={{ iconName: 'Timer' }}
              text={timeUntil}
              style={{
                border: 'none',
                height: '34px',
                backgroundColor: 'transparent',
                marginRight: '-16px',
              }}
            />
          )} */}
          <HeaderCommandBar items={commandBarItems(dispatch, store, timeUntil)} />
        </CustomHeader>
        <TabBar
          selectedTabId={store.ui.selectedTab}
          onSelectedTabChanged={newSelectedTab => dispatch(setSelectedTab({ newSelectedTab: newSelectedTab }))}
          tabSize={'tall' as any}
          renderAdditionalContent={() => (
            <HeaderCommandBarWithFilter
              filter={filter}
              items={getFilterCommandBarItems(dispatch, store)}
              filterToggled={store.ui.isFilterVisible}
            />
          )}
        >
          <Tab name="Active" id="active" badgeCount={badgeCount(store.data.pullRequests, 'active')} />
          <Tab name="Draft" id="draft" badgeCount={badgeCount(store.data.pullRequests, 'draft')} />
          <Tab name="Completed" id="completed" badgeCount={badgeCount(store.data.pullRequests, 'completed')} />
        </TabBar>
        <div className="page-content-left page-content-right page-content-top page-content-bottom">
          {getPageContent({ newSelectedTab: store.ui.selectedTab, filterItems, store })}
        </div>
      </Page>
      {store.settings.settingsPanelOpen && <SettingsPanel />}
    </Surface>
  );
};
