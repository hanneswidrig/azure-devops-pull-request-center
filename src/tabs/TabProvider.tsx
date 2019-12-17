import * as React from 'react';
import { Dispatch } from 'redux';
import { useSelector, useDispatch } from 'react-redux';

import { Draft } from './Draft';
import { Active } from './Active';
import { Page } from 'azure-devops-ui/Page';
import { Header } from 'azure-devops-ui/Header';
import { Surface } from 'azure-devops-ui/Surface';
import { TabBar, Tab } from 'azure-devops-ui/Tabs';
import { ObservableArray } from 'azure-devops-ui/Core/Observable';
import { FILTER_CHANGE_EVENT } from 'azure-devops-ui/Utilities/Filter';
import { IHeaderCommandBarItem, HeaderCommandBarWithFilter } from 'azure-devops-ui/HeaderCommandBar';

import { filter } from '..';
import { applyFilter } from '../lib/filters';
import { PrHubState, PR } from '../state/types';
import { fromPRToFilterItems } from '../state/transformData';
import {
  setSelectedTab,
  setPullRequests,
  toggleFullScreenMode,
  toggleSortDirection,
  triggerSortDirection,
  setSettings,
  clearSettings,
} from '../state/actions';
import {
  ITab,
  TabOptions,
  ActiveItemProvider,
  FilterItemsDictionary,
  FilterDictionary,
  FilterOptions,
} from './TabTypes';

const getCommandBarItems = (dispatch: Dispatch<any>, store: PrHubState): IHeaderCommandBarItem[] => {
  return [
    {
      id: 'refresh',
      text: 'Refresh',
      isPrimary: true,
      important: true,
      onActivate: () => {
        dispatch(setPullRequests());
      },
      iconProps: {
        iconName: 'fabric-icon ms-Icon--Refresh',
      },
    },
    // {
    //   id: 'save-prefs',
    //   text: 'Set as default filters',
    //   important: false,
    //   onActivate: () => {
    //     setSettings({ ...store });
    //   },
    //   iconProps: {
    //     title: 'Preserve current application state',
    //     iconName: 'fabric-icon ms-Icon--Save',
    //   },
    // },
    // {
    //   id: 'clear-prefs',
    //   text: 'Reset default filters',
    //   important: false,
    //   onActivate: () => {
    //     dispatch(clearSettings());
    //   },
    //   iconProps: {
    //     title: 'Reset default application state',
    //     iconName: 'fabric-icon ms-Icon--ClearFilter',
    //   },
    // },
    {
      id: 'full-screen',
      text: 'Full Screen Mode',
      important: false,
      onActivate: () => {
        dispatch(toggleFullScreenMode());
      },
      iconProps: {
        title: 'Visually hide or show Azure DevOps UI Shell',
        iconName: 'fabric-icon ms-Icon--FullScreen',
      },
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

const getPageContent = ({ newSelectedTab, filter, filterItems, store }: { newSelectedTab: TabOptions } & ITab) => {
  const tabs: Record<TabOptions, JSX.Element> = {
    active: <Active filter={filter} filterItems={filterItems} store={store} />,
    draft: <Draft filter={filter} filterItems={filterItems} store={store} />,
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
    const activePrsCount = pullRequests.filter(v => !v.isDraft).length;
    return activePrsCount > 0 ? activePrsCount : undefined;
  }

  if (selectedTab === 'draft') {
    const draftPrsCount = pullRequests.filter(v => v.isDraft).length;
    return draftPrsCount > 0 ? draftPrsCount : undefined;
  }
};

const setDefaultFilterState = (filterValues: FilterDictionary | undefined) => {
  if (filterValues?.searchString) {
    filter.setFilterItemState(FilterOptions.searchString, { value: filterValues.searchString });
  }

  if (filterValues?.repositories) {
    filter.setFilterItemState(FilterOptions.repositories, { value: filterValues.repositories });
  }

  if (filterValues?.sourceBranch) {
    filter.setFilterItemState(FilterOptions.sourceBranch, { value: filterValues.sourceBranch });
  }

  if (filterValues?.targetBranch) {
    filter.setFilterItemState(FilterOptions.targetBranch, { value: filterValues.targetBranch });
  }

  if (filterValues?.author) {
    filter.setFilterItemState(FilterOptions.author, { value: filterValues.author });
  }

  if (filterValues?.reviewer) {
    filter.setFilterItemState(FilterOptions.reviewer, { value: filterValues.reviewer });
  }

  if (filterValues?.myApprovalStatus) {
    filter.setFilterItemState(FilterOptions.myApprovalStatus, { value: filterValues.myApprovalStatus });
  }
};

export const pullRequestItemProvider$ = new ObservableArray<ActiveItemProvider>();
export const TabProvider: React.FC = () => {
  const store = useSelector((store: PrHubState) => store);
  const dispatch = useDispatch();

  const [filterItems, setFilterItems] = React.useState<FilterItemsDictionary>({
    repositories: [],
    sourceBranch: [],
    targetBranch: [],
    author: [],
    reviewer: [],
    myApprovalStatus: [],
  });

  React.useEffect(() => {
    pullRequestItemProvider$.splice(0, pullRequestItemProvider$.length);
    pullRequestItemProvider$.push(...applyFilter(store.data.pullRequests, {}, store.ui.selectedTab));
    setFilterItems(fromPRToFilterItems(store.data.pullRequests));
    // setDefaultFilterState(store.settings.filterValues);

    filter.subscribe(() => {
      const filterValues: FilterDictionary = {
        searchString: filter.getFilterItemValue<string>(FilterOptions.searchString),
        repositories: filter.getFilterItemValue<string[]>(FilterOptions.repositories),
        sourceBranch: filter.getFilterItemValue<string[]>(FilterOptions.sourceBranch),
        targetBranch: filter.getFilterItemValue<string[]>(FilterOptions.targetBranch),
        author: filter.getFilterItemValue<string[]>(FilterOptions.author),
        reviewer: filter.getFilterItemValue<string[]>(FilterOptions.reviewer),
        myApprovalStatus: filter.getFilterItemValue<string[]>(FilterOptions.myApprovalStatus),
      };
      pullRequestItemProvider$.splice(0, pullRequestItemProvider$.length);
      pullRequestItemProvider$.push(...applyFilter(store.data.pullRequests, filterValues, store.ui.selectedTab));
      dispatch(triggerSortDirection());
    }, FILTER_CHANGE_EVENT);
    return () => filter.unsubscribe(() => ({}), FILTER_CHANGE_EVENT);
  }, [store.data.pullRequests, store.ui.selectedTab, store.settings.filterValues, dispatch]);

  React.useEffect(() => {
    dispatch(triggerSortDirection());
  }, [store.ui.selectedTab, dispatch]);

  return (
    <Surface background={1}>
      <Page className="azure-pull-request-hub flex-grow">
        <Header title={'Pull Requests Center'} titleSize={1} commandBarItems={getCommandBarItems(dispatch, store)} />
        <TabBar
          selectedTabId={store.ui.selectedTab}
          onSelectedTabChanged={newSelectedTab => dispatch(setSelectedTab(newSelectedTab))}
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
          {/* <Tab name="Draft" id="draft" badgeCount={badgeCount(store.data.pullRequests, 'draft')} /> */}
        </TabBar>
        <div className="page-content-left page-content-right page-content-top page-content-bottom">
          {getPageContent({ newSelectedTab: store.ui.selectedTab, filter, filterItems, store })}
        </div>
      </Page>
    </Surface>
  );
};
