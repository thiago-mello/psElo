import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack'
import LoginScreen from './pages/loginScreen'
import MainScreen from './pages/mainScreen'
import TabMenu from './pages/navigationMenu/stackMenu'

const AppNavigator = createSwitchNavigator(
  {
    Login: {
      screen: LoginScreen,
    },
    Main: {
      screen: MainScreen,
    },
    Menu: {
      screen: TabMenu,
    },
  },
  {
    initialRouteName: 'Login',
    defaultNavigationOptions: {
      title: 'PsElo',
      headerStyle: {
        backgroundColor: '#FFF' , //'#255085'
      },
      headerTintColor: '#255085',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }
  }
);

const AppContainer = createAppContainer(AppNavigator);

export default AppContainer;