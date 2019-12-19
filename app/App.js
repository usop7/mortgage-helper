import React from 'react';
import { View } from 'react-native';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import combineReducers from '../src/reducers/calculationReducer';
import {
  AdMobBanner,
  AdMobRewarded,
  AdMobInterstitial,
  PublisherBanner,
} from 'react-native-admob';

import SwitchNav from '../src/screens/HomeScreen';

const store = createStore(combineReducers);

export default class App extends React.Component {

  render() {
    return (
      <Provider store={ store }>
        <SwitchNav />
        <View style={{alignItems: 'center'}}>
        <AdMobBanner
          adSize="SMART_BANNER"
          adUnitID="ca-app-pub-7468400229382992/2395801078"
          onAdFailedToLoad={error => console.log(error)} 
        />
        </View>
      </Provider>
    );
  }
}
