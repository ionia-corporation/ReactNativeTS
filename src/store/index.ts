import { Store, Middleware } from 'redux';
import reducers from './reducers/index';
import reduxThunk from 'redux-thunk';
import { applyMiddleware, createStore, compose } from 'redux';
import { AppState } from './reducers';

export default function configureStore(): Store<AppState> {
  const middlewareArray: Middleware[] = [
      reduxThunk,
  ];

  const enhancer = compose(
    applyMiddleware.apply(null, middlewareArray),
  );

  const store = createStore(reducers, enhancer);

  return store;
}
