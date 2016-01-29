import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { syncHistory } from 'react-router-redux';

import reducers from './reducers';

export default function (history, initialState) {
  // Enhance redux with middlewares and other enhancers
  const enhancer = compose(
    applyMiddleware(
      thunk, // async mw
      syncHistory(history), // router mw
    ),
    // support Chrome redux-devtools-extension
    typeof window === 'object' && window.devToolsExtension ? window.devToolsExtension() : (f) => f
  );

  return createStore(reducers, initialState, enhancer);
}
