export const defaultParser = {
  parse: (payload: string) => JSON.parse(payload),
  stringify: (payload: any) => JSON.stringify(payload),
};

export const updatesParser = {
  parse: (payload: string, previousState: any) => {
    let newValues = JSON.parse(payload);
    if (previousState && previousState.state && newValues.state) {
      const retVal = Object.assign({}, previousState.state, newValues.state);
      newValues = { state: retVal };
    }
    return newValues;
  },
  stringify: JSON.stringify,
};