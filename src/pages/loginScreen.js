import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert} from 'react-native';
import auth from '@react-native-firebase/auth';

// import { Container } from './styles';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    }
  }

  static navigationOptions = {
    title: 'Login',
  }

  componentDidMount() {
    if(auth().currentUser){
      this.navigateToMainPage();
    } 
  }

  saveEmailState = (text) => {
    this.setState({
      email: text,
    });
  }

  savePasswordState = (text) => {
    this.setState({
      password: text,
    });
  }

  logEmailAndPassword = async () => {
    try {
      let email = this.state.email;
      let password = this.state.password;

      //empty fields aren't allowed
      if(email != '' && email != null && password != '' && password != null ){ 
        await auth().signInWithEmailAndPassword(email, password);
      } else{
        Alert.alert("Campos Vazios", "Campos vazios não são permitidos");
      }
    } catch (e) {
      console.log(e.message);
      Alert.alert("Credenciais incorretas", "E-mail e/ou senha incorretos");
    }

    //When user logs in
    const unsubscribe = auth().onAuthStateChanged((user) => { 
      if(user){
          this.navigateToMainPage();
      }
    });
    unsubscribe();
  }

  navigateToMainPage = () => {
    this.props.navigation.replace('Main');
  }

  render() {
    return(
      <View style={styles.container}>
        <Text style={styles.text}>Login com e-mail e senha:</Text>
        <TextInput 
          style={styles.textInputEmail}
          keyboardType='email-address'
          placeholder="E-mail"
          onChangeText={this.saveEmailState}/>
        <TextInput 
          style={styles.textInputPassword}
          secureTextEntry={true}
          placeholder="Senha"
          onChangeText={this.savePasswordState}/>
        <TouchableOpacity 
        style={styles.loginButton}
        onPress={this.logEmailAndPassword}>
          <Text style={styles.loginButtonText}>LOGIN</Text>
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
  text: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 108,
  },
  textInputEmail: {
    marginLeft: 32,
    marginRight: 32,
    marginTop: 48,
    marginBottom: 12,
    backgroundColor: '#e8e8e8',
    alignSelf: 'stretch',
    paddingLeft: 12,
    paddingRight: 12,
    fontSize:18,
    borderTopLeftRadius:8,
    borderTopRightRadius:8,
    borderBottomColor: '#1d446f',
    borderBottomWidth: 3,
  },
  textInputPassword: {
    marginLeft: 32,
    marginRight: 32,
    marginTop: 12,
    marginBottom: 16,
    backgroundColor: '#e8e8e8',
    alignSelf: 'stretch',
    paddingLeft: 12,
    paddingRight: 12,
    fontSize:18,
    borderTopLeftRadius:8,
    borderTopRightRadius:8,
    borderBottomColor: '#1d446f',
    borderBottomWidth: 3,
  },
  loginButton: {
    alignSelf: 'stretch',
    backgroundColor: '#FFF',
    marginLeft: 32,
    marginRight: 32,
    alignItems: 'center',
    padding: 10,
    elevation: 5,
    marginTop: 32,
    borderRadius: 5,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: 'bold'
  }

});
