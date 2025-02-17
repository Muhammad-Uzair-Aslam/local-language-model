import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AppNavigator from './AppNavigator'; 
import SettingsScreen from '../screens/settingsScreen/SettingsScreen'; 

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen 
        name="Home" 
        component={AppNavigator} 
        options={{ headerShown: false }} 
      />
      <Drawer.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ headerShown: true }} 
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;