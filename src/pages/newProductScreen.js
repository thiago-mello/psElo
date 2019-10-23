import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert } from 'react-native';
import { Button, TextInput, DefaultTheme, Snackbar, TouchableRipple } from 'react-native-paper'

import DateTimePicker from 'react-native-modal-datetime-picker'
import database from '@react-native-firebase/database';

const DAY_IN_MS = 86400000;
export default class NewProductScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      batchInStock: false,
      productName: '',
      productCategory: '',
      productLocation: '',
      productBatch: '',
      productDate: '',
      productDateDay: '',
      productDateMonth: '',
      productDateYear: '',
      isExpiringSoon: false,
      isDateTimePickerVisible: false,
      isLoading: false,
      isSnackbarVisible: false,
      alertText: '',
    }
  }

  static navigationOptions = {
    title: 'Novo Produto',
    headerTintColor: '#255085',
    headerTitleStyle: {
        fontWeight: 'bold',
    },
  }

  showDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true });
  }

  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  }
  
  handleDatePicked = async (date) => {
    const daysBeforeNotification = await database().ref('/config/daysBeforeNotification').once('value');
    let isExpiring = false;
    if(date.getTime() < (Date.now() + daysBeforeNotification.val() * DAY_IN_MS)){
      isExpiring = true;
    }

    this.setState({
      productDate: date.getTime(), 
      productDateDay: date.getDate(), 
      productDateMonth: date.getMonth(), 
      productDateYear: date.getFullYear(),
      isExpiringSoon: isExpiring,
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
    this.setState({ isLoading: true });
    const referenceToProducts = database().ref('/products/' + uniqueKey);
    await referenceToProducts.set(product);
    this.setState({ isLoading: false });
  }

  createAndUploadProduct = () => {
    if(this.state.productName === ''){
      this.setState({ alertText: 'O campo Nome é obrigatório', isSnackbarVisible: true});
      return;
    } else if(this.state.productDate === ''){
      this.setState({ alertText: 'O campo Data de Validade é obrigatório', isSnackbarVisible: true});
      return;
    } else if(this.state.productBatch === ''){
      this.setState({ alertText: 'O campo lote é obrigatório', isSnackbarVisible: true});
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
      isExpiringSoon: this.state.isExpiringSoon,
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
      this.setState({ alertText: 'Produto adicionado com sucesso.', isSnackbarVisible: true});
    }).catch(() => {
      this.setState({ alertText: 'Erro ao fazer upload do produto.', isSnackbarVisible: true});
    });
  }

  render() { 
    return (
      <View style={styles.container}> 
        <ScrollView style={styles.scroll}>
          <View style={styles.container}>
            <Text style={styles.textMainLabel}>Novo Produto:</Text>
            <TextInput
              label='Nome do produto' 
              onChangeText={(text) => {this.setState({productName: text})}}
              value={this.state.productName}
              style={styles.topTextInput}
              mode='outlined'
              theme={defaultInputTheme}/>
             <TextInput
              label='Categoria'
              style={styles.textInput} 
              onChangeText={(text) => {this.setState({productCategory: text})}}
              value={this.state.productCategory}
              mode='outlined'
              theme={defaultInputTheme}/>
            <TextInput
              label='Localização do produto'
              style={styles.textInput} 
              onChangeText={(text) => {this.setState({productLocation: text})}}
              value={this.state.productLocation}
              mode='outlined'
              theme={defaultInputTheme}/>
            <View style={styles.smallTextinputContainer}>
              <TextInput 
                style={styles.smallTextinputBatch}
                label='Lote'
                onChangeText={(text) => {this.setState({productBatch: text})}}
                value={this.state.productBatch}
                mode='outlined'
                theme={defaultInputTheme} />
              <TouchableRipple
                onPress={this.showDateTimePicker}>
                <TextInput
                mode='outlined'
                disabled={true}
                style={styles.smallButtonSelectDate}
                value={this.getFormattedDate()}
                theme={defaultInputTheme}/>
              </TouchableRipple>
              <DateTimePicker
                isVisible={this.state.isDateTimePickerVisible}
                onConfirm={this.handleDatePicked}
                onCancel={this.hideDateTimePicker}/>
            </View>
            <View style={styles.smallTextinputContainer}>
              <Text style={styles.textBatchInStock}>Lote anterior em estoque:</Text>
              <Switch
                onValueChange={this.batchSwitchClicked}
                value={this.state.batchInStock}
                trackColor={{true: 'white'}}
                thumbColor= 'white'
                style={{marginHorizontal: 12}}/>
            </View>
          </View>
          <Button 
            style={styles.addProductButton}
            onPress={this.createAndUploadProduct}
            mode='contained'
            theme={defaultInputTheme}
            loading={this.state.isLoading}>
            Adicionar Produto
          </Button>
        </ScrollView>
        <Snackbar
          visible={this.state.isSnackbarVisible}
          onDismiss={() => this.setState({ isSnackbarVisible: false })}
          duration={1500}>
          {this.state.alertText}
        </Snackbar>
      </View>
    );
  }
}

const defaultInputTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      text: 'white',
      primary: '#FFF',
      placeholder: 'white',
      disabled: 'white'
    }
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#255085',
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
    alignSelf: 'center'
  },
  topTextInput: {
    backgroundColor: '#255085',
    marginHorizontal: 16,
    marginTop: 48,
    fontSize: 18,
  },
  textInput: {
    backgroundColor: '#255085',
    marginHorizontal: 16,
    marginTop: 16,
    fontSize: 18,
  },
  smallTextinputBatch: {
    flex: 0.5,
    backgroundColor: '#255085',
    marginHorizontal: 16,
    fontSize: 18,
  },
  smallButtonSelectDate: {
    paddingHorizontal: 12,
    justifyContent: 'center',
    flex: 0.5,
    marginRight: 16,
  },
  textProductDate: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 18,
  },
  smallTextinputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    marginTop: 16,
  },
  textBatchInStock: {
    fontSize: 16,
    color: '#FFF',
    marginHorizontal: 16,
  },
  addProductButton:{
    marginTop: 32,
    marginHorizontal: 16,
  },
});
