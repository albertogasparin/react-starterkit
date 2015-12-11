
import React from 'react';
import ReactDom from 'react-dom';
import { createHistory } from 'history';
import { Router } from 'react-router';

import routes from './routes';
import './client.scss';

/**
 * Fire-up React Router.
 */

const history = createHistory();

const reactRoot = window.document.getElementById('app');
ReactDom.render(
    <Router routes={routes} history={history} />
  , reactRoot);
