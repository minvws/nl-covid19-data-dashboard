// store.js
import React from 'react';

const initialState = {};
const store = React.createContext(initialState);
const { Provider } = store;

const StateProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer((state, action) => {
    switch (action.type) {
      case 'INIT_LOAD': {
        const newObject = { status: 'loading' };
        return { ...state, [action.payload.id]: newObject };
      }
      case 'LOAD_SUCCESS': {
        const data = action.payload;
        let id;
        if (data.name == 'NL_Nederland') {
          id = 'NL';
        } else {
          id = data.code;
        }
        return { ...state, [id]: { ...data, status: 'ready' } };
      }
      case 'LOAD_FAIL': {
        const failObject = { status: 'failed' };
        return { ...state, [action.payload.id]: failObject };
      }
      default:
        throw new Error();
    }
  }, initialState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider };
