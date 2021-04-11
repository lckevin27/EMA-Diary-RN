import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import LoginScreen from './LoginScreen';
import SurveyScreen from './SurveyScreen';

const MainNavigator = createStackNavigator({
  Login:  LoginScreen,
  Survey:  SurveyScreen,
}, {
  defaultNavigationOptions: {
    gesturesEnabled: false,
    swipeEnabled: false
  }
});

const App = createAppContainer(MainNavigator);

export default App;
