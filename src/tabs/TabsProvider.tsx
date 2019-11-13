import * as React from 'react';
import { Dispatch } from 'redux';
import { useSelector, useDispatch } from 'react-redux';

import { Draft } from './Draft/Draft';
import { Active } from './Active/Active';
import { PrHubState, PR } from '../state/types';
import { Page } from 'azure-devops-ui/Page';
import { applyFilter } from '../lib/filters';
import { Header } from 'azure-devops-ui/Header';
import { Surface } from 'azure-devops-ui/Surface';
import { TabBar, Tab } from 'azure-devops-ui/Tabs';
import { fromPRToFilterItems } from '../state/transformData';
import { ITableColumn, ColumnMore } from 'azure-devops-ui/Table';
import { ObservableArray } from 'azure-devops-ui/Core/Observable';
import { TabBarFilterIcon } from '../components/TabBarFilterIcon';
import { FILTER_CHANGE_EVENT } from 'azure-devops-ui/Utilities/Filter';
import { IHeaderCommandBarItem } from 'azure-devops-ui/HeaderCommandBar';
import { renderTitleColumn, renderReviewersColumn } from '../components/Columns';
import { setSelectedTab, setPullRequests, toggleFullScreenMode } from '../state/actions';
import {
  ITab,
  TabOptionsType,
  ActiveItemProvider,
  ITabProvider,
  FilterItemsDictionary,
  FilterDictionary,
  FilterOptions
} from './Tabs.types';

export const pullRequestItemProvider$ = new ObservableArray<ActiveItemProvider>();
export const TabsProvider: React.FC<ITabProvider> = ({ filter }) => {
  const { data, ui } = useSelector((store: PrHubState) => store);
  const dispatch = useDispatch();

  const [filterItems, setFilterItems] = React.useState<FilterItemsDictionary>({
    repositories: [],
    sourceBranch: [],
    targetBranch: [],
    author: [],
    reviewer: [],
    myApprovalStatus: []
  });

  React.useEffect(() => {
    pullRequestItemProvider$.splice(0, pullRequestItemProvider$.length);
    pullRequestItemProvider$.push(...applyFilter(data.pullRequests, {}, ui.selectedTab));
    setFilterItems(fromPRToFilterItems(data.pullRequests));

    filter.subscribe(() => {
      const filterValues: FilterDictionary = {
        searchString: filter.getFilterItemValue<string>(FilterOptions.searchString),
        repositories: filter.getFilterItemValue<string[]>(FilterOptions.repositories),
        sourceBranch: filter.getFilterItemValue<string[]>(FilterOptions.sourceBranch),
        targetBranch: filter.getFilterItemValue<string[]>(FilterOptions.targetBranch),
        author: filter.getFilterItemValue<string[]>(FilterOptions.author),
        reviewer: filter.getFilterItemValue<string[]>(FilterOptions.reviewer),
        myApprovalStatus: filter.getFilterItemValue<string[]>(FilterOptions.myApprovalStatus)
      };
      pullRequestItemProvider$.splice(0, pullRequestItemProvider$.length);
      pullRequestItemProvider$.push(...applyFilter(data.pullRequests, filterValues, ui.selectedTab));
    }, FILTER_CHANGE_EVENT);
    return () => filter.unsubscribe(() => {}, FILTER_CHANGE_EVENT);
  }, [filter, data.pullRequests, ui.selectedTab, setFilterItems]);

  return (
    <Surface background={1}>
      <Page className='azure-pull-request-hub flex-grow'>
        <Header title={'Pull Requests Center'} titleSize={1} commandBarItems={getCommandBarItems(dispatch)} />
        <TabBar
          selectedTabId={ui.selectedTab}
          onSelectedTabChanged={newSelectedTab => dispatch(setSelectedTab(newSelectedTab))}
          tabSize={'tall' as any}
          renderAdditionalContent={() => (
            <TabBarFilterIcon filter={filter} isFilterVisible={ui.isFilterVisible} items={[]} />
          )}
        >
          <Tab name='Active' id='active' />
          <Tab name='Draft' id='draft' />
        </TabBar>
        <div className='page-content-left page-content-right page-content-top page-content-bottom'>
          {getPageContent({ newSelectedTab: ui.selectedTab, filter, filterItems })}
        </div>
      </Page>
    </Surface>
  );
};

const getPageContent = ({ newSelectedTab, filter, filterItems }: { newSelectedTab: TabOptionsType } & ITab) => {
  const tabs: Record<TabOptionsType, JSX.Element> = {
    active: <Active filter={filter} filterItems={filterItems} />,
    draft: <Draft filter={filter} filterItems={filterItems} />
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
        iconName: 'fabric-icon ms-Icon--Refresh'
      }
    },
    {
      id: 'full-screen',
      text: 'Full Screen Mode',
      important: false,
      onActivate: () => {
        dispatch(toggleFullScreenMode());
      },
      iconProps: {
        iconName: 'fabric-icon ms-Icon--FullScreen'
      }
    }
  ];
};

export const columns: ITableColumn<PR>[] = [
  {
    id: 'title',
    name: 'Pull Request',
    renderCell: renderTitleColumn,
    width: -100
  },
  {
    id: 'reviewers',
    name: 'Reviewers',
    renderCell: renderReviewersColumn,
    width: 416
  },
  new ColumnMore(() => {
    return {
      id: 'sub-menu',
      items: [
        {
          id: 'submenu-one',
          text: 'Show Work Items',
          iconProps: { iconName: 'WorkItem' },
          onActivate: () => {}
        }
      ]
    };
  })
];
