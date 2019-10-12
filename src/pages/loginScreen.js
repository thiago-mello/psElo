import React, { Component } from 'react';

import { View, Text, StyleSheet} from 'react-native';

// import { Container } from './styles';

export default class Login extends Component {
  static navigationOptions = {
    title: 'Login',
    headerTintColor: '#255085',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  }

  render() {
    return(
      <View style={styles.container}>
        <Text style={styles.text}>Olá. Eu sou a tela de login</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#255085',
    justifyContent:'center',
    alignItems: 'center',
  },
  text: {
    color: '#FFF',
  },
});
