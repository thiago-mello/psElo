import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Switch, TouchableOpacity, Alert } from 'react-native';

import DateTimePicker from 'react-native-modal-datetime-picker'
import database from '@react-native-firebase/database';


export default class NewProductScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      batchInStock: false,
      isDateTimePickerVisible: false,
      productName: '',
      productCategory: '',
      productLocation: '',
      productBatch: '',
      productDate: '',
      productDateDay: '',
      productDateMonth: '',
      productDateYear: '',
    }
  }

  static navigationOptions = {
    title: 'Novo Produto',
  }

  showDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true });
  }

  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  }
  
  handleDatePicked = (date) => {
    this.setState({
      productDate: date.getTime(), 
      productDateDay: date.getDate(), 
      productDateMonth: date.getMonth(), 
      productDateYear: date.getFullYear(),
    });
    this.hideDateTimePicker();
  }

  getFormattedDate = () => {
    if (this.state.productDateMonth != '') {
      const date = this.state.productDateDay + '/' +
        (this.state.productDateMonth + 1) + '/' +
        this.state.productDateYear;
      return date;
    } else {
      return 'Data de Validade';
    }
  }

  batchSwitchClicked = (newValue) => {
    this.setState({batchInStock: newValue});
  }

  uploadObjectToDatabase = async (product, uniqueKey) => {
    const referenceToProducts = database().ref('/products/' + uniqueKey);
    await referenceToProducts.set(product);
  }

  createAndUploadProduct = () => {
    if(this.state.productName === ''){
      Alert.alert('Campo Requerido', 'O campo Nome é obrigatório');
      return;
    } else if(this.state.productDate === ''){
      Alert.alert('Campo Requerido', 'O campo Data de Validade é obrigatório');
      return;
    } else if(this.state.productBatch === ''){
      Alert.alert('Campo Requerido', 'O campo Lote é obrigatório');
      return;
    }

    let uniqueKey = database().ref().push().key;

    const product = {
      productName: this.state.productName,
      productCategory: this.state.productCategory,
      productLocation: this.state.productLocation,
      productBatch: this.state.productBatch,
      productDate: this.state.productDate,
      productDateDay: this.state.productDateDay,
      productDateMonth: this.state.productDateMonth,
      productDateYear: this.state.productDateYear,
      batchInStock: this.state.batchInStock,
      productId: uniqueKey,
    }

    this.uploadObjectToDatabase(product, uniqueKey).then(() => {

      const initialState = {
        batchInStock: false,
        isDateTimePickerVisible: false,
        productName: '',
        productCategory: '',
        productLocation: '',
        productBatch: '',
        productDate: '',
        productDateDay: '',
        productDateMonth: '',
        productDateYear: '',
        productId: '',
      }
      this.setState(initialState);
      Alert.alert("Produto cadastrado", "Produto adicionado com sucesso");
    }).catch(() => {
      Alert.alert("Erro", "Erro ao fazer upload do produto");
    });
  }

  render() { 
    return (
      <View style={styles.container}> 
        <ScrollView style={styles.scroll}>
          <View style={styles.container}>
            <Text style={styles.textMainLabel}>Novo Produto:</Text>
            <TextInput
              placeholder='Nome do produto'
              placeholderTextColor='rgba(255, 255, 255, 0.7)'
              style={styles.topTextInput} 
              onChangeText={(text) => {this.setState({productName: text})}}
              value={this.state.productName}/>
             <TextInput
              placeholder='Categoria'
              placeholderTextColor='rgba(255, 255, 255, 0.7)'
              style={styles.textInput} 
              onChangeText={(text) => {this.setState({productCategory: text})}}
              value={this.state.productCategory}/>
            <TextInput
              placeholder='Localização do produto'
              placeholderTextColor='rgba(255, 255, 255, 0.7)'
              style={styles.textInput} 
              onChangeText={(text) => {this.setState({productLocation: text})}}
              value={this.state.productLocation}/>
            <View style={styles.smallTextinputContainer}>
              <TextInput 
                style={styles.smallTextinputBatch}
                placeholder='Lote'
                placeholderTextColor='rgba(255, 255, 255, 0.7)'
                onChangeText={(text) => {this.setState({productBatch: text})}}
                value={this.state.productBatch}/>
              <TouchableOpacity
                style={styles.smallButtonSelectDate}
                placeholder='Data de Validade'
                placeholderTextColor='rgba(255, 255, 255, 0.7)'
                onPress={this.showDateTimePicker}>
                  <Text style={styles.textProductDate}>{this.getFormattedDate()}</Text>
              </TouchableOpacity>
              <DateTimePicker
                isVisible={this.state.isDateTimePickerVisible}
                onConfirm={this.handleDatePicked}
                onCancel={this.hideDateTimePicker}/>
            </View>
            <View style={styles.smallTextinputContainer}>
              <Text style={styles.textBatchInStock}>Produtos do lote anterior em estoque:</Text>
              <Switch
                onValueChange={this.batchSwitchClicked}
                value={this.state.batchInStock}
                trackColor={{true: 'white'}}
                thumbColor= 'white'/>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.addProductButton}
            onPress={this.createAndUploadProduct}>
            <Text style={styles.addProductButtonText}>Adicionar Produto</Text>
          </TouchableOpacity>
        </ScrollView>
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
  scroll: {
    alignSelf: 'stretch',
    paddingBottom: 12, 
  },
  textMainLabel: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 32,
  },
  topTextInput: {
    marginLeft: 32,
    marginRight: 32,
    marginTop: 48,
    height: 53,
    paddingLeft: 12,
    paddingRight: 12,
    alignSelf: 'stretch',
    color: '#FFF',
    borderWidth: 2,
    borderColor: '#FFF',
    borderRadius: 8,
    fontSize: 18,
  },
  textInput: {
    marginLeft: 32,
    marginRight: 32,
    marginTop: 24,
    paddingLeft: 12,
    paddingRight: 12,
    height: 53,
    alignSelf: 'stretch',
    color: '#FFF',
    borderWidth: 2,
    borderColor: '#FFF',
    borderRadius: 8,
    fontSize: 18,
  },
  smallTextinputBatch: {
    paddingLeft: 12,
    paddingRight: 12,
    flex: 0.35,
    height: 53,
    color: '#FFF',
    borderWidth: 2,
    borderColor: '#FFF',
    borderRadius: 8,
    fontSize: 18,
  },
  smallButtonSelectDate: {
    paddingLeft: 12,
    paddingRight: 12,
    justifyContent: 'center',
    flex: 0.5,
    height: 53,
    color: '#FFF',
    borderWidth: 2,
    borderColor: '#FFF',
    borderRadius: 8,
  },
  textProductDate: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 18,
  },
  smallTextinputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    marginLeft: 32,
    marginRight: 32,
    marginTop: 24,
  },
  textBatchInStock: {
    fontSize: 16,
    color: '#FFF'
  },
  addProductButton:{
    backgroundColor: '#FFF',
    marginHorizontal: 32,
    alignItems: 'center',
    padding: 10,
    elevation: 5,
    marginTop: 24,
    borderRadius: 5,
  },
  addProductButtonText: {
    fontSize: 16,
    color: '#255085',
    fontWeight: 'bold',
  }

});
