import { constants } from '../reducers/sample';

export function increment() {
  return {
    type: constants.INCREMENT,
  };
}
