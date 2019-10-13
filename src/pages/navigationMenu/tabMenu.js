import React, { Component } from 'react';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Icon from 'react-native-vector-icons/Ionicons'

import MainScreen from '../mainScreen';
import NewProductScreen from '../newProductScreen';


// import { Container } from './styles';

const tabNavigator = createBottomTabNavigator(
  {
  Home: MainScreen,
  NewProduct: NewProductScreen,
},

{
  defaultNavigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ tintColor }) => {
      const { routeName } = navigation.state;
      let iconName;
      if (routeName === 'Home') {
        iconName = `md-home`;
      } else if (routeName === 'NewProduct') {
        iconName = `md-add`;
      }

      return <Icon name={iconName} size={25} color={tintColor} />;
    },
  }),
  tabBarOptions: {
    activeTintColor: '#255085',
    labelStyle: {
      fontSize: 12,
    },
  }
});

export default createAppContainer(tabNavigator);
