import 'react-app-polyfill/stable';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';

import { initializeIcons } from '@uifabric/icons';
import * as DevOps from 'azure-devops-extension-sdk';
import { Filter } from 'azure-devops-ui/Utilities/Filter';

import './index.scss';
import { reducer } from './state/store';
import { onInitialLoad } from './state/actions';
import { TabProvider } from './tabs/TabProvider';

const store = createStore(reducer, applyMiddleware(thunk));
export const filter: Filter = new Filter();
initializeIcons();

const App: React.FC = () => {
  React.useEffect(() => {
    store.dispatch(onInitialLoad());
  }, []);

  return (
    <Provider store={store}>
      <TabProvider />
    </Provider>
  );
};

DevOps.init();
DevOps.ready().then(() => {
  ReactDOM.render(<App />, document.getElementById('root'));
});
