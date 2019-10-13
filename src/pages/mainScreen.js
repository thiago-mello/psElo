import React, { Component } from 'react';
import auth from '@react-native-firebase/auth';

import { View, Text, TouchableOpacity } from 'react-native';

// import { Container } from './styles';

export default class pages extends Component {
  static navigationOptions = {
    title: 'Home',
  }

  logOut = () => {
    auth().signOut().then(this.navigateToLoginPage);
  }

  navigateToLoginPage = () => {
    console.log(this.props.navigation.navigate);
    this.props.navigation.navigate('Login');
  }

  render() {
    return (
      <View>
        <TouchableOpacity
          onPress={this.logOut}>
          <Text>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
