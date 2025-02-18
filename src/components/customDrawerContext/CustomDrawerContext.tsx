import React from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { View, Text, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';

const CustomDrawerContent = (props: any) => {
  const handleLogout = async () => {
    try {
      await auth().signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerHeader}>
        <Text style={styles.drawerHeaderText}>AI Assistant</Text>
        <Text style={styles.drawerSubText}>
          {auth().currentUser?.email || 'Guest User'}
        </Text>
      </View>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Logout"
        onPress={handleLogout}
        labelStyle={styles.logoutText}
      />
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  drawerHeader: {
    padding: 20,
    backgroundColor: '#1a237e',
    marginBottom: 10,
  },
  drawerHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  drawerSubText: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  logoutText: {
    color: '#D32F2F',
  },
});

export default CustomDrawerContent;