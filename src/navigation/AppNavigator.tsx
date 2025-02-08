import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/homeScreen/HomeScreen';

const AppStack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <AppStack.Navigator>
      <AppStack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{headerShown:false}}
      />
    </AppStack.Navigator>
  );
};

export default AppNavigator;