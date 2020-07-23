// store.js
import React from 'react';

const initialState = {};
const AppContext = React.createContext<Partial<TContextProps>>(initialState);

type TContextProps = {
  // TODO: type this to actual data
  [id: string]: any;
};

interface IAction {
  type: string;
  payload: any;
}

// TODO: strictly type state to allowed properties
function reducer(state: any, action: IAction) {
  switch (action.type) {
    case 'INIT_LOAD': {
      const newObject = { status: 'loading' };
      return { ...state, [action.payload.id]: newObject };
    }
    case 'LOAD_SUCCESS': {
      const data = action.payload;
      let id: string;
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
}

const StateProvider: React.FC = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext as store, StateProvider };
