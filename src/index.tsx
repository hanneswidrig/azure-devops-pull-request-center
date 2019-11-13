import * as React from 'react';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { addPolyFills } from './polyfills';
import { createStore, applyMiddleware, Dispatch } from 'redux';

import * as DevOps from 'azure-devops-extension-sdk';
import { Filter } from 'azure-devops-ui/Utilities/Filter';

import './index.scss';
import { reducer } from './state/store';
import { showRootComponent } from './common';
import { TabsProvider } from './tabs/TabsProvider';
import { setCurrentUser, setRepositories, setPullRequests } from './state/actions';

addPolyFills();

const store = createStore(reducer, applyMiddleware(thunk));

export class App extends React.PureComponent {
  private filter: Filter;
  private dispatch: Dispatch<any>;

  constructor(props: {}) {
    super(props);

    this.filter = new Filter();
    this.dispatch = store.dispatch;
  }

  public async componentDidMount() {
    await DevOps.init();

    this.dispatch(setCurrentUser());
    this.dispatch(setRepositories());
    this.dispatch(setPullRequests());
  }

  public render(): JSX.Element {
    return (
      <Provider store={store}>
        <TabsProvider filter={this.filter} />
      </Provider>
    );
  }
}
showRootComponent(<App />);
