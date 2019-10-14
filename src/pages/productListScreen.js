import React, { Component } from 'react';
import database from '@react-native-firebase/database';
import { View, Text, StyleSheet, FlatList } from 'react-native';

// import { Container } from './styles';


export default class ProductList extends Component {
  constructor(props){
    super(props);
    this.state = {
      productArray: [],      
    }
  }
  componentDidMount(){
    this.getDatabaseData();
  }

  getDatabaseData = async () => {
    let dataArray = [];
    const databaseReference = database().ref('/products');
    const snapshot = await databaseReference.orderByChild('productDate').once('value');
    snapshot.forEach((snapshot) => {
      dataArray.push(snapshot.val());
    });
    this.setState({ productArray: dataArray });
  }

  ListItem({item}){
    return (
      <View style={styles.listItemContainer}>
        <Text style={styles.listProductName}>{item.productName}</Text>
      </View>
    );
  } 

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.mainText}>
          Lista de produtos
        </Text>
        <FlatList 
          contentContainerStyle={styles.flatlistStyle}
          data={this.state.productArray}
          renderItem={this.ListItem}
          keyExtractor={(item) =>{ return item.productId}}
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
    marginTop: 48,
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
    
  },
  listItemContainer: {
    backgroundColor: 'rgb(206,206,206)',
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
    
  }
})