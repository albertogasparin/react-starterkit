
import ReactDom from 'react-dom';
import { createHistory } from 'history';

import createRoutes from './routes';

import './all.scss';

/**
 * Fire-up React Router.
 */

const history = createHistory();
const reactRoot = window.document.getElementById('app');

ReactDom.render(createRoutes(history), reactRoot);
