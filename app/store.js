import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import reducers from './providers';

export let store;

export default function(initialState, api, thunkMiddleware = thunk) {
  // Enhance redux with middlewares and other enhancers
  const enhancer = compose(
    applyMiddleware(
      // async mw
      thunkMiddleware.withExtraArgument(api)
    ),
    // support Chrome redux-devtools-extension
    __CLIENT__ && window.devToolsExtension ? window.devToolsExtension() : f => f
  );

  store = createStore(reducers, initialState, enhancer);
  return store;
}
