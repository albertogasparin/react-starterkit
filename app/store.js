import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { syncReduxAndRouter } from 'redux-simple-router';

import reducers from './reducers';

export default function (history, initialState) {
  // Enhance createStore with async middleware
  const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
  const store = createStoreWithMiddleware(reducers, initialState);

  syncReduxAndRouter(history, store);

  return store;
}
