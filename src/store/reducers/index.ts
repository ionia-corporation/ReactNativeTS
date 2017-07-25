import { combineReducers } from 'redux';
import { SampleState, reducer as sample, initialState as sampleInitialState } from './sample';
import { Action } from 'redux-actions';

export type AppState = {
  sample?: SampleState;
};

export const constants = {
  REDUX_INITIAL_STATE: 'INITIAL_STATE',
};

const appReducer = combineReducers({
  sample,
});

const rootReducer = (state: AppState, action: Action<number>) => {
  if (action.type === constants.REDUX_INITIAL_STATE) {
    state = {
      sample: sampleInitialState,
    };
  }

  return appReducer(state, action);
};

export default rootReducer;

