import { combineReducers, AnyAction } from 'redux';
import { reducer as blueprint, BlueprintState } from './blueprint/reducers';
import { reducer as profile, ProfileState } from './profile/reducers';
// import { default as createMqttReducer, MqttState } from './mqtt';

export type AppState = {
  blueprint: BlueprintState,
  profile: ProfileState,
  // mqtt: MqttState;
};

export const constants = {
  REDUX_INITIAL_STATE: 'INITIAL_STATE',
};

const appReducer = combineReducers({
  blueprint,
  profile,
  // mqtt: createMqttReducer({
  //   _log: {
  //     parse: JSON.parse,
  //     stringify: JSON.stringify,
  //   },
  //   battery: {
  //     parse: JSON.parse,
  //     stringify: JSON.stringify,
  //   },
  // }),
});

const rootReducer = (state: AppState, action: AnyAction) => {
  if (action.type === constants.REDUX_INITIAL_STATE) {
    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;
