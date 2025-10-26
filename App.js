
import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ReportScreen from './src/screens/ReportScreen';
import StatusScreen from './src/screens/StatusScreen';
import MapScreen from './src/screens/MapScreen';
import DrivingModeScreen from './src/screens/DrivingModeScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ReportScreen">
        <Stack.Screen name="Report an Issue" component={ReportScreen} />
        <Stack.Screen name="Track Status" component={StatusScreen} />
        <Stack.Screen name="Map View" component={MapScreen} />
        <Stack.Screen name="Driving Mode" component={DrivingModeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
