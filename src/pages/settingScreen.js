import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { Button, DefaultTheme, Snackbar } from 'react-native-paper';

import database from '@react-native-firebase/database';

export default class Settings extends Component {
  constructor(props){
    super(props);
    this.state = {
      isSaving: false,
      daysBeforeNotification: '',
      daysBeforeExclusion: '',
      alertMessage: '',
      isAlertVisible: false
    }

    this.getConfigData();
  }
  static navigationOptions = {
    title: 'Configurações',
    headerTintColor: '#255085',
    headerTitleStyle: {
        fontWeight: 'bold',
    },
  }

  getConfigData = async () => {
    const databaseRef = database().ref('/config');
    const dataSnapshot = await databaseRef.once('value');
    const config = dataSnapshot.val();
    

    this.setState({
      daysBeforeExclusion: config.daysBeforeExclusion.toString(),
      daysBeforeNotification: config.daysBeforeNotification.toString(),
    });
  }

  saveDatabaseConfig = () => {
    this.setState({ isSaving: true });
    const databaseRef = database().ref('/config');
    const daysBeforeNotification = parseInt(this.state.daysBeforeNotification);
    const daysBeforeExclusion = parseInt(this.state.daysBeforeExclusion);

    if(Number.isNaN(daysBeforeNotification) || Number.isNaN(daysBeforeExclusion)){
      this.setState({alertMessage: 'Por favor, insira um número.', isAlertVisible: true});
    }else{
      if(daysBeforeNotification <= 0 || daysBeforeExclusion <= 0){
        this.setState({alertMessage: 'Por favor, insira somente números positivos.', isAlertVisible: true});
      } else{
        try{
          databaseRef.child('daysBeforeExclusion').set(daysBeforeExclusion);
          databaseRef.child('daysBeforeNotification').set(daysBeforeNotification);
          this.setState({alertMessage: 'Configurações salvas com sucesso.', isAlertVisible: true});
        } catch(e) {
          console.log(e.message);
        }
      }
    }
    this.setState({ isSaving: false })
  }

  render() {
    return (
    <View style={styles.container}>
        <View style={styles.row}>
          <Text style={styles.label}>Dias antes do vencimento para notificação:</Text>
          <TextInput 
          style={styles.input}
          keyboardType='decimal-pad'
          onChangeText={(text) => {this.setState({daysBeforeNotification: text})}}
          value={this.state.daysBeforeNotification}/>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Dias após o vencimento para exclusão automática:</Text>
          <TextInput 
          style={styles.input}
          onChangeText={(text) => {this.setState({daysBeforeExclusion: text})}}
          value={this.state.daysBeforeExclusion}/>
        </View>

        <Button 
        mode='contained'
        theme={defaultInputTheme}
        style={styles.button}
        loading={this.state.isSaving}
        onPress={this.saveDatabaseConfig}>
          Salvar
        </Button>
      <Snackbar
        visible={this.state.isAlertVisible}
        onDismiss={() => this.setState({ isAlertVisible: false })}
        duration={1500}>
        {this.state.alertMessage}
      </Snackbar>
    </View>);
  }
}

const defaultInputTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    text: 'white',
    primary: '#FFF',
    placeholder: 'white',
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#255085',
    paddingTop: 32,
    alignItems: 'stretch',
  },
  label: {
    flex: 0.7,
    color: 'white',
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 32,
  },
  input: {
    flex: 0.2,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 5,
    paddingHorizontal: 12,
    fontSize: 16,
    color: 'white',
  },
  button: {
    marginTop: 32,
    marginHorizontal: 16,
  },
});
