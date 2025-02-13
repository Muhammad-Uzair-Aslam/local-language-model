import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import auth from '@react-native-firebase/auth';

const CustomDrawer = (props: any) => {
  const handleLogout = async () => {
    try {
      await auth().signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props}>
        <View style={styles.headerContainer}>
          <View style={styles.userInfoContainer}>
            <Text style={styles.userName}>
              {auth().currentUser?.email || 'User'}
            </Text>
          </View>
        </View>
        <View style={styles.drawerListWrapper}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  userInfoContainer: {
    marginLeft: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  drawerListWrapper: {
    marginTop: 10,
  },
  logoutButton: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  logoutText: {
    fontSize: 16,
    color: 'red',
  },
});

export default CustomDrawer;