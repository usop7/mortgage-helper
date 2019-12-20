import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import combineReducers from '../src/reducers/calculationReducer';

import SwitchNav from '../src/screens/HomeScreen';

const store = createStore(combineReducers);

export default class App extends React.Component {

  render() {
    return (
      <Provider store={ store }>
        <SwitchNav />
      </Provider>
    );
  }
}
