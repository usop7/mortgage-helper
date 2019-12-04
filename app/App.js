import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import calculationReducer from '../src/reducers/calculationReducer';

import SwitchNav from '../src/screens/HomeScreen';

const store = createStore(calculationReducer);

export default class App extends React.Component {

  render() {
    return (
      <Provider store={ store }>
        <SwitchNav />
      </Provider>
    );
  }
}
