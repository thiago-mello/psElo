import React, { Component } from 'react';
import auth from '@react-native-firebase/auth';

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

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
      <View style={styles.container}>
        <TouchableOpacity
          onPress={this.logOut}
          style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#255085',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#FFF',
    marginLeft: 32,
    marginRight: 32,
    alignItems: 'center',
    padding: 10,
    elevation: 5,
    marginTop: 32,
    borderRadius: 5,
  },
  logoutButtonText: {
    fontSize: 16,
    color: '#255085',
    fontWeight: 'bold',
  }
});
