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
        backgroundColor: '#1d446f' , //'#255085'
      }
    }
  }
);

const AppContainer = createAppContainer(AppNavigator);

export default AppContainer;