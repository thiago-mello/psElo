import React, { Component } from 'react';
import database from '@react-native-firebase/database'
import { View, Text, TextInput, StyleSheet } from 'react-native';

// import { Container } from './styles';

export default class ProductSeachScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchedProductsData: [],
      searchText: '',
    }
  }
  
  static navigationOptions = {
    title: 'Buscar',
  }

  searchForProducts = () => {
    const searchText = this.state.searchText;
    this.databaseQuery(searchText);
  }

  databaseQuery = async (searchText) => {
    const searchDataArray = [];
    const databaseReference = database().ref('/products');
    let snapshot = await databaseReference
      .orderByChild('productName')
      .startAt(searchText)
      .endAt(searchText + "\uf8ff")
      .once('value');

    snapshot.forEach((snapshot) => {
      searchDataArray.push(snapshot.val());
    });

    this.setState({ searchedProductsData: searchDataArray });
    console.log(searchDataArray);
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput 
          placeholder='Buscar por Nome'
          placeholderTextColor='rgba(255, 255, 255, 0.6)'
          style={styles.searchInput}
          returnKeyType='search'
          onChangeText={(text) => this.setState({ searchText: text})}
          onSubmitEditing={this.searchForProducts}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#255085',
    alignItems: 'stretch',
  },
  searchInput: {
    marginTop: 4,
    marginHorizontal: 32,
    paddingHorizontal: 12,
    color: '#FFF',
    borderWidth: 2,
    borderRadius: 8,
    borderColor: '#FFF',
    fontSize: 18,
  }
});
