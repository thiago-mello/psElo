import React, { Component } from 'react';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import { firebase} from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import NotifService from '../config/notifService';

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';


export default class pages extends Component {
  constructor(props) {
    super(props);
    const date = new Date();
    this.state = {
      productsExpiringSoon: null,
      productsRegistered: null,
      hourOfDay: (date.getHours()),
    }
    this.saveDadabaseConfig();
    this.notif = new NotifService();

  }

  static navigationOptions = {
    title: 'Home',
  }

  componentDidMount() {
    this.saveMessagingRegToken();
    this.createMessageListener();
    this.onTokenRefreshListener = firebase.messaging().onTokenRefresh((token) => {
      const tokenPath = '/users/' + '01';
      const tokenReference = database().ref(tokenPath);
      databaseUserToken = {
        uId: firebase.auth().currentUser.uid,
        userFcmToken: token,
      };
      tokenReference.set(databaseUserToken);
    });

    this.checkMessagingPermission();
  }

  componentWillUnmount(){
    this.onTokenRefreshListener();
    this.messageListener();
  }


  async createMessageListener() {
    this.messageListener = firebase.messaging().onMessage((message) => {
      console.log(message.data);
      //alert('Dados recebidos');
      PushNotification.localNotification({
        title: 'Dados recebidos',
        message: 'Os dados foram recebidos pela FCM'
      });
    });
    console.log('listener created');
  }

  checkMessagingPermission = async () => {
    const enabled = await firebase.messaging().hasPermission();
    console.log('permission:', enabled);
    if (!enabled) {
      try {
        await firebase.messaging().requestPermission();
      } catch (error) {
        alert('Permissão é necessária para notificações');
      }
    }
  }

  saveMessagingRegToken = async () => {
    const fcmToken = await firebase.messaging().getToken();
    const tokenPath = '/users/' + '01';
    const tokenReference = database().ref(tokenPath);
    databaseUserToken = {
      uId: firebase.auth().currentUser.uid,
      userFcmToken: fcmToken,
    };
    tokenReference.set(databaseUserToken);
  }

  saveDadabaseConfig = async () => {
    const databaseRef = database().ref('/config');
    const snapshot = await databaseRef.once('value');
    const config = snapshot.val();

    this.setState({ 
      productsExpiringSoon: config.productsExpiringSoon,
      productsRegistered: config.productsRegistered,
    });
  }

  logOut = () => {
    auth().signOut().then(this.navigateToLoginPage);
  }

  navigateToLoginPage = () => {
    console.log(this.props.navigation.navigate);
    this.props.navigation.navigate('Login');
  }

  getGreetings = () => {
    let greeting = 'Bom dia!'
    if(18 < this.state.hourOfDay || this.state.hourOfDay < 4){
      greeting = 'Boa noite!'
    } else if(12 < this.state.hourOfDay && this.state.hourOfDay < 18){
      greeting = 'Boa tarde!'
    }

    return greeting;
  }

  render() {
    
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.greetings}>{this.getGreetings()} Hoje temos:</Text>
          <Text style={styles.cardText}>{this.state.productsRegistered} produtos cadastrados.</Text>
          <Text style={styles.cardText}>{this.state.productsExpiringSoon} produtos próximos da data de validade.</Text>
        </View>
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
  },
  card: {
    marginHorizontal: 16,
    marginTop: 48,
    paddingHorizontal: 16,
    backgroundColor: '#FFF',
    alignSelf: 'stretch',
    borderRadius: 5,
  },
  greetings: {
    color: '#255085',
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  cardText: {
    fontSize: 16,
    marginVertical: 8,
    fontWeight: '700',
    color: 'rgba(120, 120, 120, 0.9)'
  },
});
