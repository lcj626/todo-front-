import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import CalendarScreen from './components/calendar/CalendarScreen';

const Tap = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tap.Navigator>
          <Tap.Screen
              name='Calender'
              component={CalendarScreen}
          />
      </Tap.Navigator>
    </NavigationContainer>
  )
}

