import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Text, View, StyleSheet } from 'react-native';
import HomeScreen from '../screens/homeScreen/HomeScreen';
import CustomDrawerContent from '../components/customDrawerContext/CustomDrawerContext';

const Drawer = createDrawerNavigator();

// Placeholder screens for drawer items
const SettingsScreen = () => (
  <View style={styles.screenContainer}>
    <Text style={styles.screenText}>Settings Screen</Text>
  </View>
);

const ProfileScreen = () => (
  <View style={styles.screenContainer}>
    <Text style={styles.screenText}>Profile Screen</Text>
  </View>
);

const AboutScreen = () => (
  <View style={styles.screenContainer}>
    <Text style={styles.screenText}>About Screen</Text>
  </View>
);

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1a237e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        drawerActiveBackgroundColor: '#1a237e',
        drawerActiveTintColor: '#fff',
        drawerInactiveTintColor: '#333',
      }}>
      <Drawer.Screen 
        name="AI Assistant" 
        component={HomeScreen}
      />
      <Drawer.Screen 
        name="Profile" 
        component={ProfileScreen}
      />
      <Drawer.Screen 
        name="Settings" 
        component={SettingsScreen}
      />
      <Drawer.Screen 
        name="About" 
        component={AboutScreen}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a237e',
  },
});

export default DrawerNavigator;