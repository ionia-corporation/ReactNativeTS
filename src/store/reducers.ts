import { combineReducers, AnyAction } from 'redux';

import { Action } from 'redux-actions';
import { reducer as blueprint, BlueprintState } from './blueprint/reducers';
import { reducer as profile, ProfileState } from './profile/reducers';
import { default as createMqttReducer, MqttState, defaultParser, updatesParser } from './mqtt';

export type AppState = {
  blueprint: BlueprintState,
  profile: ProfileState,
  mqtt: MqttState;
};

export const constants = {
  REDUX_INITIAL_STATE: 'INITIAL_STATE',
};

const appReducer = combineReducers({
  blueprint,
  profile,
  mqtt: createMqttReducer({
    _log: defaultParser,
    '_updates/fields': updatesParser,
  }),
});

const rootReducer = (state: AppState, action: Action<any>) => {
  if (action.type === constants.REDUX_INITIAL_STATE) {
    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;
