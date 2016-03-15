import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import reducers from './reducers';

export default function (initialState) {
  // Enhance redux with middlewares and other enhancers
  const enhancer = compose(
    applyMiddleware(
      thunk, // async mw
    ),
    // support Chrome redux-devtools-extension
    typeof window === 'object' && window.devToolsExtension ? window.devToolsExtension() : (f) => f
  );

  return createStore(reducers, initialState, enhancer);
}
