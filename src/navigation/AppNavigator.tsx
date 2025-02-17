import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/homeScreen/HomeScreen';
import SettingsScreen from '../screens/settingsScreen/SettingsScreen';
import { RootStackParamList } from '../types/types';

const AppStack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <AppStack.Navigator>
      <AppStack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{headerShown: false}}
      />
      <AppStack.Screen 
        name="Setting" 
        component={SettingsScreen} 
        options={{headerShown: false}}
      />
    </AppStack.Navigator>
  );
};

export default AppNavigator;