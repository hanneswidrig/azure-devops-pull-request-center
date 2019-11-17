import 'react-app-polyfill/stable';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, Dispatch } from 'redux';

import * as DevOps from 'azure-devops-extension-sdk';
import { Filter } from 'azure-devops-ui/Utilities/Filter';

import './index.scss';
import { reducer } from './state/store';
import { TabProvider } from './tabs/TabProvider';
import { setCurrentUser, setRepositories, setPullRequests } from './state/actions';

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
        <TabProvider filter={this.filter} />
      </Provider>
    );
  }
}
ReactDOM.render(<App />, document.getElementById('root'));
