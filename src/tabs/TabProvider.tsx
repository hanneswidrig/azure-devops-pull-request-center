import * as React from 'react';
import { Dispatch } from 'redux';
import { useSelector, useDispatch } from 'react-redux';

import { Draft } from './Draft';
import { Active } from './Active';
import { Page } from 'azure-devops-ui/Page';
import { Header } from 'azure-devops-ui/Header';
import { Surface } from 'azure-devops-ui/Surface';
import { TabBar, Tab } from 'azure-devops-ui/Tabs';
import { ITableColumn, ColumnMore } from 'azure-devops-ui/Table';
import { ObservableArray } from 'azure-devops-ui/Core/Observable';
import { FILTER_CHANGE_EVENT, Filter } from 'azure-devops-ui/Utilities/Filter';
import { IHeaderCommandBarItem, HeaderCommandBarWithFilter } from 'azure-devops-ui/HeaderCommandBar';

import { applyFilter } from '../lib/filters';
import { PrHubState, PR } from '../state/types';
import { fromPRToFilterItems } from '../state/transformData';
import { titleColumn, reviewersColumn } from '../components/PRTableCellColumns';
import { setSelectedTab, setPullRequests, toggleFullScreenMode } from '../state/actions';
import {
  ITab,
  TabOptions,
  ActiveItemProvider,
  FilterItemsDictionary,
  FilterDictionary,
  FilterOptions,
} from './TabTypes';

type Props = { filter: Filter };

export const pullRequestItemProvider$ = new ObservableArray<ActiveItemProvider>();
export const TabProvider: React.FC<Props> = ({ filter }) => {
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
    }, FILTER_CHANGE_EVENT);
    return () => filter.unsubscribe(() => {}, FILTER_CHANGE_EVENT);
  }, [filter, store.data.pullRequests, store.ui.selectedTab, setFilterItems]);

  return (
    <Surface background={1}>
      <Page className="azure-pull-request-hub flex-grow">
        <Header title={'Pull Requests Center'} titleSize={1} commandBarItems={getCommandBarItems(dispatch)} />
        <TabBar
          selectedTabId={store.ui.selectedTab}
          onSelectedTabChanged={newSelectedTab => dispatch(setSelectedTab(newSelectedTab))}
          tabSize={'tall' as any}
          renderAdditionalContent={() => (
            <HeaderCommandBarWithFilter filter={filter} items={[]} filterToggled={store.ui.isFilterVisible} />
          )}
        >
          <Tab name="Active" id="active" />
          <Tab name="Draft" id="draft" />
        </TabBar>
        <div className="page-content-left page-content-right page-content-top page-content-bottom">
          {getPageContent({ newSelectedTab: store.ui.selectedTab, filter, filterItems, store })}
        </div>
      </Page>
    </Surface>
  );
};

const getPageContent = ({ newSelectedTab, filter, filterItems, store }: { newSelectedTab: TabOptions } & ITab) => {
  const tabs: Record<TabOptions, JSX.Element> = {
    active: <Active filter={filter} filterItems={filterItems} store={store} />,
    draft: <Draft filter={filter} filterItems={filterItems} store={store} />,
  };
  return tabs[newSelectedTab];
};

const getCommandBarItems = (dispatch: Dispatch<any>): IHeaderCommandBarItem[] => {
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
    {
      id: 'full-screen',
      text: 'Full Screen Mode',
      important: false,
      onActivate: () => {
        dispatch(toggleFullScreenMode());
      },
      iconProps: {
        iconName: 'fabric-icon ms-Icon--FullScreen',
      },
    },
  ];
};

export const columns: ITableColumn<PR>[] = [
  {
    id: 'title',
    name: 'Pull Request',
    renderCell: titleColumn,
    width: -100,
  },
  {
    id: 'reviewers',
    name: 'Reviewers',
    renderCell: reviewersColumn,
    width: 416,
  },
  new ColumnMore(() => {
    return {
      id: 'sub-menu',
      items: [
        {
          id: 'submenu-one',
          text: 'Show Work Items',
          iconProps: { iconName: 'WorkItem' },
          onActivate: () => {},
        },
      ],
    };
  }),
];
