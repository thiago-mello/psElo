import React, { Component } from 'react';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import Icon from 'react-native-vector-icons/Ionicons'

import MainScreen from '../mainScreen';
import NewProductScreen from '../newProductScreen';
import ProductListScreen from '../productListScreen';
import SettingsScreen from '../settingScreen';


const newProductStack = createAppContainer(
  createStackNavigator({
    NewProduct: NewProductScreen,
  })
)

const homeStack = createAppContainer(
  createStackNavigator({
    Home: MainScreen,
    Settings: SettingsScreen,
  })
)

const productListStack = createAppContainer(
  createStackNavigator({
    ProductList: ProductListScreen,
  })
)

const tabNavigator = createBottomTabNavigator(
  {
    'Home': homeStack,
    'Novo Produto': newProductStack,
    'Lista de Produtos': productListStack,
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'Home') {
          iconName = `md-home`;
        } else if (routeName === 'Novo Produto') {
          iconName = `md-add`;
        } else if (routeName === 'Lista de Produtos') {
          iconName = `md-list`;
        }

        return <Icon name={iconName} size={25} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      keyboardHidesTabBar: true,
      activeTintColor: '#255085',
      labelStyle: {
        fontSize: 12,
      },
    }
  });

export default createAppContainer(tabNavigator);
