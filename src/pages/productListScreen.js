import React, { Component } from 'react';
import database from '@react-native-firebase/database';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Alert } from 'react-native';
import { List, IconButton, Colors } from 'react-native-paper';


export default class ProductList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productArray: [],
      searchText: '',
      isRefreshing: false,
      daysBeforeNotification: 0,
    }
  }

  static navigationOptions = {
    title: 'Lista de Produtos',
    headerTintColor: '#255085',
    headerTitleStyle: {
        fontWeight: 'bold',
    },
  }

  componentDidMount() {
    this.getPageData();
  }

  getDatabaseData = async () => {
    this.setState({ isRefreshing: true });
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

  getDatabaseConfig = async () => {
    const configRef = database().ref('/config/daysBeforeNotification');
    const snapshot = await configRef.once('value');

    this.setState( {daysBeforeNotification: snapshot.val() });
  }

  getPageData = async () => {
    await this.getDatabaseConfig();
    this.getDatabaseData();
  }

  searchDatabase = async () => {
    let dataArray = [];
    const searchText = this.state.searchText
    const databaseReference = database().ref('/products');
    const snapshot = await databaseReference
      .orderByChild('productName')
      .startAt(searchText)
      .endAt(searchText + "\uf8ff")
      .once('value');

    snapshot.forEach((snapshot) => {
      dataArray.push(snapshot.val());
    });

    this.setState({ productArray: dataArray });
  }

  deleteObjectFromDatabase = (item) => {
    const databaseReference = database().ref('products/' + item.productId);

    Alert.alert(
      'Aviso:',
      'Deseja mesmo excluir o item ' + item.productName + '?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {text: 'Sim', onPress: () => {databaseReference.remove(); this.getDatabaseData();}},
      ],
      {cancelable: false},
    );

    
  }

  ListItem = ({ item }) => {
    const date = item.productDateDay + '/' + (item.productDateMonth + 1) + '/' + item.productDateYear;
    let dateStyle = styles.listDateText;

    if(item.productDate < Date.now()){
      dateStyle = styles.listDateTextDanger;
    } else if(item.productDate <= Date.now() + this.state.daysBeforeNotification * 86400000){
      dateStyle = styles.listDateTextWarning;
    }
    
    return (
      <View style={styles.listItemContainer}>
        <List.Accordion
          title={item.productName}
          titleStyle={styles.listProductName}
          description={'Venc: ' + date}
          descriptionStyle={dateStyle}>
          <View style={styles.expandedContainer}>
            <View>
              <Text style={styles.listCategoryText}>{item.productCategory}</Text>
              <Text style={styles.listBatchText}>Lote {item.productBatch}</Text>
              <Text style={styles.listBatchText}>Localização: {item.productLocation}</Text>
            </View>
            <View style={{justifyContent: 'center'}}>
              <IconButton 
                icon='delete'
                color={Colors.red500}
                onPress={() => { this.deleteObjectFromDatabase(item) }}/>
            </View>
          </View>
        </List.Accordion>
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
          onChangeText={(text) => { this.setState({ searchText: text }) }}
          onSubmitEditing={this.searchDatabase}/>
        <Text style={styles.mainText}>
          Lista de produtos
        </Text>
        <FlatList
          contentContainerStyle={styles.flatlistStyle}
          data={this.state.productArray}
          renderItem={this.ListItem}
          keyExtractor={(item) => { return item.productId }}
          onRefresh={this.getDatabaseData}
          refreshing={this.state.isRefreshing}/>
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
    borderRadius: 5,
  },
  listProductName: {
    color: '#255085',
    fontSize: 16,
    fontWeight: 'bold',
  },
  flatlistStyle: {
    padding: 16,
  },
  listCategoryText: {
    color: 'rgba(107, 107, 107, 0.9)',
    fontWeight: '700',
    fontSize: 16,
  },
  listBatchText: {
    color: 'rgba(107, 107, 107, 0.71)',
    fontSize: 16,
  },
  listDateText: {
    fontSize: 16,
  },
  listDateTextWarning: {
    fontSize: 16,
    color: '#ff9800'
  },
  listDateTextDanger: {
    fontSize: 16,
    color: '#f44336',
  },
  listAlignment: {
    marginVertical: 2,
    marginHorizontal: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  expandedContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  listEraseButton: {
    borderWidth: 1,
    borderColor: '#f44336',
    borderRadius: 5,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
    height: 36,
  },  
  listProductEraseButtonText: {
    color: '#f44336',
  },
  listSearchBar: {
    marginTop: 8,
    height: 44,
    paddingHorizontal: 12,
    alignSelf: 'stretch',
    color: '#FFF',
    borderWidth: 1,
    borderColor: '#FFF',
    borderRadius: 5,
    fontSize: 19,
    marginHorizontal: 16,
  }

})