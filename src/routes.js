import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack'
import LoginScreen from './pages/loginScreen'
import MainScreen from './pages/mainScreen'
import TabMenu from './pages/navigationMenu/tabMenu'

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
      title: 'psElo',
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