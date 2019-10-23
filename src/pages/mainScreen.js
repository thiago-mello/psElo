import React, { Component } from 'react';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import { firebase } from '@react-native-firebase/messaging';
import NotifService from '../config/notifService';
import Icon from 'react-native-vector-icons/Ionicons'
import { Surface } from 'react-native-paper';

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';


export default class pages extends Component {
  constructor(props) {
    super(props);
    const date = new Date();
    this.state = {
      productsExpiringSoon: null,
      daysBeforeNotification: 7,
      productsRegistered: null,
      hourOfDay: (date.getHours()),
      nextProductsExpiring: [],
      isLoading: false,
    }

    this.notif = new NotifService();
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Home',
      headerTintColor: '#255085',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      headerRight: (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            style={{ marginRight: 16 }}
            onPress={() => navigation.navigate('Settings')}>
            <Icon name='md-settings' size={25} color='#255085' />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ marginRight: 16 }}
            onPress={navigation.getParam('logOut')}>
            <Icon name='md-log-out' size={25} color='#255085' />
          </TouchableOpacity>
        </View>
      )
    }
  }

  componentDidMount() {
    this.getDatabaseDataToBeRendered();
    this.saveMessagingRegToken();
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
    this.props.navigation.setParams({ logOut: this.logOut });
  }

  checkMessagingPermission = async () => {
    const enabled = await firebase.messaging().hasPermission();
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
      daysBeforeNotification: config.daysBeforeNotification,
    });
  }

  getNextProductsExpiring = async () => {
    const productsArray = [];
    const productsSnapshot = await database().ref('/products')
      .orderByChild('productDate')
      .startAt(Date.now())
      .once('value');

    productsSnapshot.forEach((snapshot) => {
      let style = styles.listItemDate;
      
      //if product is expiring soon
      if(snapshot.val().productDate < Date.now() + this.state.daysBeforeNotification * 86400000){
        style = styles.listItemDateWarning;
      }

      if(productsArray.length < 3){
        const product = {
          ...snapshot.val(),
          style: style,
        }
        productsArray.push(product);
      }else{
         return true;
      }
    });
    this.setState({ nextProductsExpiring: productsArray });
  }

  getDatabaseDataToBeRendered = async () => {
    this.setState({ isLoading: true });
    await this.saveDadabaseConfig();
    await this.getNextProductsExpiring();
    this.setState({ isLoading: false });
  }

  logOut = () => {
    auth().signOut().then(this.navigateToLoginPage);
  }

  navigateToLoginPage = () => {
    console.log(this.props.navigation.navigate);
    this.props.navigation.navigate('Login');
  }

  getGreetings = () => {
    let greeting = 'Bom dia.'
    if(18 <= this.state.hourOfDay || this.state.hourOfDay <= 4){
      greeting = 'Boa noite.'
    } else if(12 <= this.state.hourOfDay && this.state.hourOfDay < 18){
      greeting = 'Boa tarde.'
    }
    return greeting;
  }

  nextProductsRenderItem = ({item}) => {
    return(
      <View>
        <Text style={styles.listItemTitle}>{item.productName}</Text>
        <Text style={item.style}>
          {item.productDateDay}/{item.productDateMonth + 1}/{item.productDateYear}
        </Text>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>

        <Surface style={styles.card}>
          <Text style={styles.cardTitle}>{this.getGreetings()}</Text>
          <View style={styles.horizontalRule} />

          <Text style={styles.statusLabel}>Status dos produtos:</Text>
          <Text style={styles.cardText}>{this.state.productsRegistered} produto(s) cadastrado(s).</Text>
          <Text style={styles.cardText}>
           {this.state.productsExpiringSoon} produto(s) próximo(s) da data de validade.
          </Text>
        </Surface>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Próximos vencimentos:</Text>
          <View style={styles.horizontalRule}/>
          <FlatList
            renderItem={this.nextProductsRenderItem}
            keyExtractor={(item) => { return item.productId }}
            data={this.state.nextProductsExpiring} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#255085',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  card: {
    marginTop: 24,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    alignSelf: 'stretch',
    borderRadius: 5,
    elevation: 5,
  },
  cardTitle: {
    color: '#255085',
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  statusLabel: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: 'bold'
  },
  horizontalRule: {
    borderBottomColor: 'rgba(170, 170, 170, 0.8)',
    borderBottomWidth: 1,
    marginHorizontal: -16,
  },
  cardText: {
    fontSize: 16,
    marginVertical: 8,
    fontWeight: '700',
    color: 'rgba(120, 120, 120, 0.9)'
  },
  listItemTitle: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  listItemDate:{
    color: 'rgba(110, 110, 110, 0.9)',
    marginBottom: 8,
  },
  listItemDateWarning:{
    color: 'rgba(245, 121, 21, 0.9)',
    marginBottom: 8,
  }
});
