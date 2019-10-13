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

  loginEmailAndPassword = async () => {
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
    this.props.navigation.navigate('Menu');
  }

  render() {
    return(
      <View style={styles.container}>
        <Text style={styles.text}>Login com e-mail e senha:</Text>
        <TextInput 
          style={styles.textInputEmail}
          keyboardType='email-address'
          placeholder="E-mail"
          placeholderTextColor='white'
          onChangeText={this.saveEmailState}/>
        <TextInput 
          style={styles.textInputPassword}
          secureTextEntry={true}
          placeholder="Senha"
          placeholderTextColor='white'
          onChangeText={this.savePasswordState}/>
        <TouchableOpacity 
        style={styles.loginButton}
        onPress={this.loginEmailAndPassword}>
          <Text style={styles.loginButtonText}>Login</Text>
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
    marginTop: 72,
  },
  textInputEmail: {
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
  textInputPassword: {
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
    fontSize: 16,
    color: '#255085',
    fontWeight: 'bold',
  }

});
