import * as React from 'react';
import { Dispatch } from 'redux';
import { useSelector, useDispatch } from 'react-redux';

import { Draft } from './Draft/Draft';
import { Active } from './Active/Active';
import { PrHubState } from '../state/types';
import { Page } from 'azure-devops-ui/Page';
import { Header } from 'azure-devops-ui/Header';
import { Surface } from 'azure-devops-ui/Surface';
import { TabBar, Tab } from 'azure-devops-ui/Tabs';
import { ITab, TabOptionsType } from './Tabs.types';
import { Filter } from 'azure-devops-ui/Utilities/Filter';
import { TabBarFilterIcon } from '../components/TabBarFilterIcon';
import { IHeaderCommandBarItem } from 'azure-devops-ui/HeaderCommandBar';
import { setSelectedTab, setPullRequests, toggleFullScreenMode } from '../state/actions';

export const TabsProvider: React.FC<ITab> = ({ filter }) => {
  const { ui } = useSelector((store: PrHubState) => store);
  const dispatch = useDispatch();

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
          {getPageContent(ui.selectedTab, filter)}
        </div>
      </Page>
    </Surface>
  );
};

const getPageContent = (newSelectedTab: TabOptionsType, filter: Filter) => {
  const tabs: Record<TabOptionsType, JSX.Element> = {
    active: <Active filter={filter} />,
    draft: <Draft filter={filter} />
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
