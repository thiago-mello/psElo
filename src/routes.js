import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack'
import LoginScreen from './pages/loginScreen'

const AppNavigator = createStackNavigator(
  {
    Login: {
      screen: LoginScreen,
    }
  },
  {
    initialRouteName: 'Login',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#FFF' , //'#255085'
      }
    }
  }
);

const AppContainer = createAppContainer(AppNavigator);

export default AppContainer;