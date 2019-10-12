import React, { Component } from 'react';

import { View, Text } from 'react-native';

// import { Container } from './styles';

export default class Login extends Component {
  static navigationOptions = {
    title: 'Login',
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  }

  render() {
    return(
      <View>
        <Text>Olá. Eu sou a tela de login</Text>
      </View>
    );
  }
}
