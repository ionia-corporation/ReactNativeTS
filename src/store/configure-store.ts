import * as Redux from 'redux';
import {createBlueprintMiddleware } from './blueprint/middleware';
import { createLogger } from 'redux-logger';
import reducers from './reducers';
import reduxThunk from 'redux-thunk';
import { applyMiddleware, createStore, compose } from 'redux';
import { AppState } from './reducers';
import { composeWithDevTools } from 'remote-redux-devtools';

export function configureStore(): Redux.Store<AppState> {
  const logger = createLogger();
  const middlewareArray: Redux.Middleware[] = [
      reduxThunk,
      createBlueprintMiddleware(),
      logger,
  ];

  // const composeEnhancers = composeWithDevTools({ realtime: true, port: 8000 })
  const enhancer = compose(
    // Function.prototype.apply
    applyMiddleware.apply(null, middlewareArray),
  );

  const store = createStore(reducers, enhancer);

  return store;
}

export const store = configureStore();