import React, { Component } from 'react';

import { View, Text } from 'react-native';

// import { Container } from './styles';

export default class NewProductScreen extends Component {
  static navigationOptions = {
    title: 'Novo Produto',
  }
  render() {
    return (
      <View>
        <Text>Cadastro de Produtos</Text>
      </View>
    );
  }
}
