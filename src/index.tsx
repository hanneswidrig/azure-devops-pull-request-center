import 'azure-devops-ui/Core/override.css';
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
    store.dispatch(actions.setCurrentUser(getUser()));
    store.dispatch(asyncActions.restoreSettings());
    store.dispatch(asyncActions.getPullRequests());
    store.dispatch(asyncActions.getCompletedPullRequests());
  }, []);

  return (
    <Provider store={store}>
      <TabProvider />
    </Provider>
  );
};

initializeIcons();

init().then(() =>
  ready().then(() => {
    ReactDOM.render(<App />, document.getElementById('root'));
  })
);
