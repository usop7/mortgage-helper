import React from 'react';

import { Text, View } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';

import CalculatorScreen from './CalculatorScreen'
import DetailScreen from './DetailScreen'
import SavedScreen from './SavedScreen'


class RateScreen extends React.Component {

    render() {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Mortgage raet API..</Text>
        </View>
      );
    }
}

const TabNavigator = createBottomTabNavigator(
    {
        Calculator: CalculatorScreen,
        Detail: DetailScreen,
        Rate: RateScreen,
        Saved: SavedScreen
    },
    {
        defaultNavigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ focused, horizontal, tintColor }) => {
                const { routeName } = navigation.state;
                let iconName = "search";
                if (routeName === 'Calculator') {
                    iconName = "calculator";
                } else if (routeName === 'Detail') {
                    iconName = "list";
                } else if (routeName === 'Rate') {
                    iconName = "percent";
                } else if (routeName === 'Saved') {
                    iconName = "bookmark-o";
                }

                // You can return any component that you like here!
                return  <Icon name={iconName} size={25} color={tintColor} />;
            },
        }),
        tabBarOptions: {
            activeTintColor: '#007AFF',
            inactiveTintColor: 'gray',
        },
  }
);

export default createAppContainer(TabNavigator);