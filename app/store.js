import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { syncHistory } from 'redux-simple-router';

import reducers from './reducers';

export default function (history, initialState) {
  // Enhance createStore with middlewares
  const createStoreWithMiddleware = applyMiddleware(
    thunk, // async mw
    syncHistory(history), // router mw
  )(createStore);

  const store = createStoreWithMiddleware(reducers, initialState);

  return store;
}
