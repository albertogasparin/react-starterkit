
import React from 'react';
import ReactDom from 'react-dom';
import { createHistory } from 'history';
import { Provider } from 'react-redux';
import { Router } from 'react-router';

import createMainStore from './store';
import routes from './routes';
import './client.scss';

/**
 * Setup history and store
 */

const history = createHistory();
const store = createMainStore(history, window.__INITIAL_STATE__);

/**
 * Fire-up React Redux + Router.
 */

const reactRoot = window.document.getElementById('app');
ReactDom.render(
  <Provider store={store}>
    <Router routes={routes} history={history} />
  </Provider>, reactRoot);
