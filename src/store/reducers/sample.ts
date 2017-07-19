import * as ReduxActions from 'redux-actions';
import { includes, keyBy, uniqBy, valuesIn } from 'lodash';
import { AppState } from './index';

export const constants = {
  INCREMENT: 'sample/INCREMENT',
};

type Action = ReduxActions.Action<string>;
type Reducer = (state: SampleState, action: Action) => SampleState;

export const initialState: SampleState = {
  val: 0,
};

export interface SampleState {
  val: number;
};

const increment: Reducer = (state, action) => {
  return { val: ++state.val };
};

export const reducer: Reducer = (state = initialState, action) => {
  const actionMap = {
    [constants.INCREMENT]: increment,
  };

  if (actionMap[action.type]) {
    return actionMap[action.type](state, action);
  }

  return state;
};


//
// Selectors
//

export const getVal = (state: AppState, userId?: string): number =>
  state.sample ? state.sample.val : -1;
