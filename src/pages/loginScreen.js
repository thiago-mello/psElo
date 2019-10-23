import React, { Component } from 'react';
import { View, Text, StyleSheet} from 'react-native';
import auth from '@react-native-firebase/auth';
import { Button, TextInput, DefaultTheme, Snackbar } from 'react-native-paper'

// import { Container } from './styles';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      isLoading: false,
      areFieldsEmpty: false,
      isDataIncorrect: false,
    }
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
      this.setState({ isLoading: true });
      let email = this.state.email;
      let password = this.state.password;

      //empty fields aren't allowed
      if(email != '' && email != null && password != '' && password != null ){ 
        await auth().signInWithEmailAndPassword(email, password);
      } else{
        this.setState({ 
          areFieldsEmpty: true,
          isLoading: false, 
        });
      }
    } catch (e) {
      console.log(e.message);
      this.setState({ 
        isDataIncorrect: true,
        isLoading: false,
       });
    }

    //When user logs in
    const unsubscribe = auth().onAuthStateChanged((user) => { 
      if(user){
        this.setState({ isLoading: false });
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
        label='E-mail'
        style={styles.textInputEmail}
        value={this.state.email}
        keyboardType='email-address'
        onChangeText={this.saveEmailState}
        mode='outlined'
        theme={defaultInputTheme}/>
        <TextInput 
          style={styles.textInputPassword}
          secureTextEntry={true}
          label="Senha"
          onChangeText={this.savePasswordState}
          onSubmitEditing={this.loginEmailAndPassword}
          theme={defaultInputTheme}
          mode='outlined'/>
        <Button 
        style={styles.loginButton}
        onPress={this.loginEmailAndPassword}
        theme={defaultInputTheme}
        mode='contained'
        loading={this.state.isLoading}>
          Login
        </Button>

        <Snackbar
          visible={this.state.areFieldsEmpty}
          onDismiss={() => this.setState({ areFieldsEmpty: false })}>
          Campos vazios não são permitidos
        </Snackbar>

        <Snackbar
          visible={this.state.isDataIncorrect}
          onDismiss={() => this.setState({ isDataIncorrect: false })}>
          E-mail e/ou senha incorretos
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
    }
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#255085',
  },
  text: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 86,
    alignSelf: 'center',
  },
  textInputEmail: {
    marginHorizontal: 16,
    marginTop: 48,
    backgroundColor: '#255085',
    color: 'white',
  },
  textInputPassword: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#255085',
    color: 'white',
  },
  loginButton: {
    marginTop: 32,
    marginHorizontal: 16,
  },
});
