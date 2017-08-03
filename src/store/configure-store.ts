import * as Redux from 'redux';
import createBlueprintMiddleware from './blueprint/middleware';
import reducers from './reducers';
import reduxThunk from 'redux-thunk';
import { applyMiddleware, createStore, compose } from 'redux';
import { AppState } from './reducers';

export default function configureStore(): Redux.Store<AppState> {
  const middlewareArray: Redux.Middleware[] = [
      reduxThunk,
      createBlueprintMiddleware(),
  ];

  let composeEnhancers = compose;

  const enhancer = composeEnhancers(
    // Function.prototype.apply
    applyMiddleware.apply(null, middlewareArray),
  );

  const store = createStore(reducers, enhancer);

  return store;
}
