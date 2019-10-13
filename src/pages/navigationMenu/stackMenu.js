import { createStackNavigator } from 'react-navigation-stack'
import { createAppContainer } from 'react-navigation'

import TabMenu from './tabMenu'

const navigator = createStackNavigator(
  {
  Menu: TabMenu,
},
{
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
})

export default createAppContainer(navigator);