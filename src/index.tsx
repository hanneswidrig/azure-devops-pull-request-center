import * as React from 'react';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { addPolyFills } from './polyfills';
import { createStore, applyMiddleware, Dispatch } from 'redux';

import { Page } from 'azure-devops-ui/Page';
import { Header } from 'azure-devops-ui/Header';
import { Surface } from 'azure-devops-ui/Surface';
import { Tab, TabBar } from 'azure-devops-ui/Tabs';
import * as DevOps from 'azure-devops-extension-sdk';
import { Filter } from 'azure-devops-ui/Utilities/Filter';
import { IHostPageLayoutService } from 'azure-devops-extension-api';
import { IHeaderCommandBarItem } from 'azure-devops-ui/HeaderCommandBar';

import './index.scss';
import { Draft } from './tabs/Draft/Draft';
import { Active } from './tabs/Active/Active';
import { reducer } from './state/store';
import { PrHubState } from './state/types';
import { showRootComponent } from './common';
import { TabBarFilterIcon } from './components/TabBarFilterIcon';
import { setCurrentUser, setRepositories, setPullRequests } from './state/actions';

interface IHubContentState {
  selectedTabId: string;
  headerDescription?: string;
  useLargeTitle?: boolean;
  useCompactPivots?: boolean;
}

addPolyFills();

const store = createStore(reducer, applyMiddleware(thunk));

export class App extends React.Component<{}, IHubContentState> {
  private filter: Filter;
  private dispatch: Dispatch<any>;
  private reduxStore: PrHubState;

  constructor(props: {}) {
    super(props);

    this.state = {
      selectedTabId: 'active'
    };

    this.filter = new Filter();
    this.dispatch = store.dispatch;
    this.reduxStore = store.getState();
  }

  public async componentDidMount() {
    await DevOps.init();

    // INITIAL DISPATCHES
    this.dispatch(setCurrentUser());
    this.dispatch(setRepositories());
    this.dispatch(setPullRequests());
  }

  public render(): JSX.Element {
    const { selectedTabId } = this.state;

    return (
      <Provider store={store}>
        <Surface background={1}>
          <Page className='azure-pull-request-hub flex-grow'>
            <Header
              title={'Pull Requests Center'}
              titleSize={1}
              description={''}
              commandBarItems={this.getCommandBarItems()}
            />
            <TabBar
              selectedTabId={selectedTabId}
              onSelectedTabChanged={(newTabId: string) => this.setState({ selectedTabId: newTabId })}
              tabSize={'tall' as any}
              renderAdditionalContent={() => (
                <TabBarFilterIcon
                  filter={this.filter}
                  isFilterVisible={this.reduxStore.ui.isFilterVisible}
                  items={[]}
                />
              )}
            >
              <Tab name='Active' id='active' />
              <Tab name='Draft' id='draft' />
            </TabBar>
            <div className='page-content-left page-content-right page-content-top page-content-bottom'>
              {this.getPageContent()}
            </div>
          </Page>
        </Surface>
      </Provider>
    );
  }

  private getPageContent() {
    switch (this.state.selectedTabId) {
      case 'active':
        return <Active filter={this.filter} />;
      case 'draft':
        return <Draft filter={this.filter} />;
      default:
        return null;
    }
  }

  private getCommandBarItems(): IHeaderCommandBarItem[] {
    return [
      {
        id: 'refresh',
        text: 'Refresh',
        isPrimary: true,
        important: true,
        onActivate: () => {
          this.dispatch(setPullRequests());
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
          this.toggleFullScreenMode();
        },
        iconProps: {
          iconName: 'fabric-icon ms-Icon--FullScreen'
        }
      }
    ];
  }

  private async toggleFullScreenMode(): Promise<void> {
    const layoutService = await DevOps.getService<IHostPageLayoutService>('ms.vss-features.host-page-layout-service');
    const fullScreenMode = await layoutService.getFullScreenMode();
    layoutService.setFullScreenMode(!fullScreenMode);
  }
}

showRootComponent(<App />);
