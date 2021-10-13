import 'react-app-polyfill/stable';

import React from 'react';
import * as ReactDOM from 'react-dom';

import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { init, ready } from 'azure-devops-extension-sdk';

import { initializeIcons } from '@uifabric/icons';
import { Filter } from 'azure-devops-ui/Utilities/Filter';
import { composeWithDevTools } from 'remote-redux-devtools';

import './index.scss';
import { reducer } from './state/store';
import { onInitialLoad } from './state/actions';
import { TabProvider } from './components/TabProvider';

const enhancer = applyMiddleware(thunk);
const enhancerWithDevTools = composeWithDevTools({ name: 'PRC', realtime: true, port: 8000 })(applyMiddleware(thunk));
export const store = createStore(reducer, process.env.NODE_ENV === 'development' ? enhancerWithDevTools : enhancer);
export const filter: Filter = new Filter();
initializeIcons();

const App = () => {
  React.useEffect(() => {
    store.dispatch(onInitialLoad());
  }, []);

  return (
    <Provider store={store}>
      <TabProvider />
    </Provider>
  );
};

init().then(() =>
  ready().then(() => {
    ReactDOM.render(<App />, document.getElementById('root'));
  })
);
