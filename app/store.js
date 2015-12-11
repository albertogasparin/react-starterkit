import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import reducers from './reducers';

export default function (initialState) {
  // Enhance createStore with async middleware
  const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

  return createStoreWithMiddleware(reducers, initialState);
}
