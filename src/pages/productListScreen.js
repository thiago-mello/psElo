import React, { Component } from 'react';
import database from '@react-native-firebase/database';
import { View, Text, StyleSheet, FlatList, TextInput } from 'react-native';

// import { Container } from './styles';


export default class ProductList extends Component {
  constructor(props){
    super(props);
    this.state = {
      productArray: [],
      searchText: '',
      isRefreshing: false,      
    }
  }

  static navigationOptions = {
    title: 'Lista de Produtos',
  }

  componentDidMount() {
    this.getDatabaseData();
  }
  
  getDatabaseData = async () => {
    this.setState({ isRefreshing: true});
    let dataArray = [];
    const databaseReference = database().ref('/products');
    const snapshot = await databaseReference.orderByChild('productDate').once('value');
    snapshot.forEach((snapshot) => {
      dataArray.push(snapshot.val());
    });

    this.setState({
      productArray: dataArray,
      isRefreshing: false,
    });
  }

  searchDatabase = async () => {
    let dataArray = [];
    const searchText = this.state.searchText
    const databaseReference = database().ref('/products');
    const snapshot = await databaseReference
      .orderByChild('productName')
      .startAt(searchText)
      .endAt(searchText+ "\uf8ff")
      .once('value');

    snapshot.forEach((snapshot) => {
      dataArray.push(snapshot.val());
    });

    this.setState({ productArray: dataArray });
  }

  ListItem({item}){
    const date = item.productDateDay + '/' + (item.productDateMonth + 1) + '/' + item.productDateYear

    return (
      <View style={styles.listItemContainer}>
        <View style={styles.listAlignment}>
          <Text style={styles.listProductName}>{item.productName}</Text>
          <Text style={styles.listDateAndBatchText}>Venc: {date}</Text>
        </View>
        <View style={styles.listAlignment}>
          <Text style={styles.listCategoryText}>{item.productCategory}</Text>
          <Text style={styles.listDateAndBatchText}>Lote: {item.productBatch}</Text>
        </View>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          placeholder='Buscar por Nome'
          placeholderTextColor='rgba(255, 255, 255, 0.7)'
          style={styles.listSearchBar}
          returnKeyType='search'
          onChangeText={(text) => {this.setState({ searchText: text })}}
          onSubmitEditing={this.searchDatabase}
          />
          
        <Text style={styles.mainText}>
          Lista de produtos
        </Text>
        <FlatList 
          contentContainerStyle={styles.flatlistStyle}
          data={this.state.productArray}
          renderItem={this.ListItem}
          keyExtractor={(item) =>{ return item.productId}}
          onRefresh={this.getDatabaseData}
          refreshing={this.state.isRefreshing}
          />      
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#255085',
    alignItems: 'stretch',
    paddingHorizontal: 32,
  },
  mainText: {
    color: 'white',
    marginTop: 19,
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
    
  },
  listItemContainer: {
    backgroundColor: 'white',
    marginTop: 8,
    borderRadius: 8,
    padding: 4,
  },
  listProductName: {
    color: '#255085',
    fontSize: 16,
    fontWeight: 'bold',
  },
  flatlistStyle: {
    
  },
  listCategoryText: {
    color: 'rgba(107, 107, 107, 0.71)',
    fontSize: 16,
  },
  listDateAndBatchText: {
    color: 'rgba(107, 107, 107, 0.71)',
    fontSize: 16,
  },
  listAlignment: {
    marginVertical: 2,
    marginHorizontal: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listSearchBar: {
    marginTop: 8,
    height: 44,
    paddingHorizontal: 12,
    alignSelf: 'stretch',
    color: '#FFF',
    borderWidth: 2,
    borderColor: '#FFF',
    borderRadius: 8,
    fontSize: 19,
  }
})