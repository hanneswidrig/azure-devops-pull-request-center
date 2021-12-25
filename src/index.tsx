import 'react-app-polyfill/stable';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { initializeIcons } from '@fluentui/font-icons-mdl2';
import { getUser, init, ready } from 'azure-devops-extension-sdk';

import './index.css';
import { TabProvider } from './components/TabProvider';
import { store, actions, asyncActions } from './state/store';

const App = () => {
  React.useEffect(() => {
    store.dispatch(asyncActions.restoreSettings());
    store.dispatch(actions.setCurrentUser(getUser()));
    store.dispatch(asyncActions.getPullRequests());
    store.dispatch(actions.removeAsyncTask());
  }, []);

  return <TabProvider />;
};

initializeIcons();

init().then(() =>
  ready().then(() => {
    ReactDOM.render(
      <Provider store={store}>
        <App />
      </Provider>,
      document.getElementById('root')
    );
  })
);
