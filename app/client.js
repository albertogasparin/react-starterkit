
import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';

import './client.scss';
import createMainStore from './store';
import routes from './routes';

/**
 * Setup history and store
 */

const store = createMainStore(window.__INITIAL_STATE__);

/**
 * Fire-up React Redux + Router.
 */

const reactRoot = window.document.getElementById('app');
ReactDom.render(
  <Provider store={store}>
    <Router routes={routes} history={browserHistory} />
  </Provider>, reactRoot);
