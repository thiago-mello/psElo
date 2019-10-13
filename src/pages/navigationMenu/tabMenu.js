import React, { Component } from 'react';
import { View } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator} from 'react-navigation-stack';

import MainScreen from '../mainScreen';
import NewProductScreen from '../newProductScreen';


// import { Container } from './styles';

const tabNavigator = createBottomTabNavigator({
  Home: MainScreen,
  NewProduct: NewProductScreen,
});

export default createAppContainer(tabNavigator);
