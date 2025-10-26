
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ReportScreen from '../screens/ReportScreen';
import MapScreen from '../screens/MapScreen';
import StatusScreen from '../screens/StatusScreen';
import DrivingModeScreen from '../screens/DrivingModeScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Report">
      <Stack.Screen name="Report" component={ReportScreen} />
      <Stack.Screen name="Map" component={MapScreen} />
      <Stack.Screen name="Status" component={StatusScreen} />
      <Stack.Screen name="DrivingMode" component={DrivingModeScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
