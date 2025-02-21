import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Animated,
  Dimensions,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { useUser } from '../../context/UserContext';
import  { getAuth, signOut } from '@react-native-firebase/auth'; // Import Firebase Auth
import { getApp } from '@react-native-firebase/app';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface SideMenuProps {
  visible: boolean;
  onClose: () => void;
  onNavigate: (screen: string) => void;
  onChangeTokens: (tokens: string) => void;
  numTokens: string;
}

const SideMenu: React.FC<SideMenuProps> = ({
    visible,
    onClose,
    onNavigate,
    onChangeTokens,
    numTokens,
  }) => {
    const translateX = React.useRef(new Animated.Value(-SCREEN_WIDTH)).current;
    const [isSettingsExpanded, setIsSettingsExpanded] = useState(false);
    const [settingsValue, setSettingsValue] = useState('');
    const { userInfo, setUserInfo,logout } = useUser(); // Assuming setUserInfo is available

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: visible ? 0 : -SCREEN_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const handleMenuItemPress = (itemName: string) => {
    if (itemName === 'Settings') {
      setIsSettingsExpanded(!isSettingsExpanded);
    } else if (itemName === 'Logout') {
      handleLogout();
    } else {
      onNavigate(itemName);
      onClose();
    }
  };

  const handleLogout = async () => {
    const app = getApp();
  const auth = getAuth(app);
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: async () => {
            try {
                await signOut(auth);
                logout(); 
                GoogleSignin.signOut()
                onClose(); 
            } catch (error) {
              console.error('Logout Error:', error);
            }
          }
        },
      ],
      { cancelable: true }
    );
  };

  const menuItems = [
    {name: 'Home', icon: 'home-outline'},
    {name: 'Settings', icon: 'settings-outline'},
    {name: 'Logout', icon: 'log-out-outline'}, // Added Logout
  ];

  const RenderUserProfile = () => {
    if (!userInfo) {
      return (
        <View style={styles.profileContainer}>
          <Text style={styles.welcomeText}>Welcome, Guest!</Text>
        </View>
      );
    }

    return (
      <View style={styles.profileContainer}>
        {userInfo.photoURL && (
          <Image
            source={{ uri: userInfo.photoURL }}
            style={styles.profileImage}
          />
        )}
        <Text style={styles.welcomeText}>
          Welcome, {userInfo.displayName || 'User'}!
        </Text>
        <Text style={styles.emailText}>{userInfo.email}</Text>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Animated.View
          style={[styles.menuContainer, {transform: [{translateX}]}]}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Menu</Text>
          </View>

          <RenderUserProfile />

          {menuItems.map(item => (
            <View key={item.name}>
              <TouchableOpacity
                style={[
                  styles.menuItem,
                  item.name === 'Settings' &&
                    isSettingsExpanded &&
                    styles.activeMenuItem,
                ]}
                onPress={() => handleMenuItemPress(item.name)}>
                <Ionicons name={item.icon} size={24} color="#333" />
                <Text style={styles.menuText}>{item.name}</Text>
                {item.name === 'Settings' && (
                  <Ionicons
                    name={isSettingsExpanded ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color="#333"
                    style={styles.chevron}
                  />
                )}
              </TouchableOpacity>

              {item.name === 'Settings' && isSettingsExpanded && (
                <View style={styles.settingsInputContainer}>
                  <Text style={styles.token}>Set Token For Response</Text>
                  <TextInput
                    style={styles.tokenInput}
                    placeholder="Tokens"
                    keyboardType="numeric"
                    value={numTokens}
                    onChangeText={onChangeTokens}
                  />
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={() => {
                      console.log('Saving setting:', settingsValue);
                      setIsSettingsExpanded(false);
                    }}>
                    <Text style={styles.saveButtonText}>Save</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </Animated.View>
        <TouchableOpacity
          style={styles.overlayButton}
          onPress={onClose}
          activeOpacity={1}>
          <Text style={{ display: 'none' }}></Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'row',
  },
  overlayButton: {
    flex: 1,
  },
  menuContainer: {
    width: SCREEN_WIDTH * 0.75,
    backgroundColor: '#F5F7FB',
    height: '100%',
  },
  header: {
    backgroundColor: '#1a237e',
    padding: 20,
    paddingTop: 40,
  },
  headerText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  emailText: {
    fontSize: 16,
    color: '#666',
  },
  token: {
    fontWeight: '500',
    marginBottom: 10,
    color: 'gray',
  },
  tokenInput: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  activeMenuItem: {
    backgroundColor: '#E3F2FD',
  },
  menuText: {
    fontSize: 16,
    marginLeft: 15,
    color: '#333',
    flex: 1,
  },
  chevron: {
    marginLeft: 'auto',
  },
  settingsInputContainer: {
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  saveButton: {
    backgroundColor: '#1a237e',
    padding: 10,
    borderRadius: 25,
    paddingVertical: 12,
    marginVertical: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
});

export default SideMenu;
