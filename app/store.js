import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import reducers from './reducers';

export default function (initialState, thunkMiddleware = thunk) {
  // Enhance redux with middlewares and other enhancers
  const enhancer = compose(
    applyMiddleware(
      // async mw
      thunkMiddleware,
      // redux-immutable-state-invariant mw (DEV only)
      __CLIENT__ && window.reduxImmutable ? window.reduxImmutable() : ((s) => (n) => (a) => n(a))
    ),
    // support Chrome redux-devtools-extension
    __CLIENT__ && window.devToolsExtension ? window.devToolsExtension() : (f) => f
  );

  return createStore(reducers, initialState, enhancer);
}
