import React, { useEffect, useState } from 'react';
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
import { getAuth, signOut } from '@react-native-firebase/auth';
import { getApp } from '@react-native-firebase/app';
import { logout, User } from '../../store/slices/authSlice';
import LottieView from 'lottie-react-native';
import ChatList from '../chatList/ChatList';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHook';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface ChatItem {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  userId: string;
}

interface RootState {
  auth: {
    isLoading: boolean;
    user: User | null;
  };
}

interface SideMenuProps {
  visible: boolean;
  onClose: () => void;
  onNavigate: (screen: string) => void;
  onChangeTokens: (tokens: string) => void;
  numTokens: string;
  onNewChat: () => void;
  chats: ChatItem[];
}

interface Message {
  role: 'user' | 'system';
  content: string;
}

const SideMenu: React.FC<SideMenuProps> = ({
  visible,
  onClose,
  onNavigate,
  onChangeTokens,
  numTokens,
  onNewChat,
  chats,
}) => {
  const translateX = React.useRef(new Animated.Value(-SCREEN_WIDTH)).current;
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(false);
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector((state: RootState) => state.auth.user);
  const isLoading = useAppSelector((state: RootState) => state.auth.isLoading);

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
    } else if (itemName === 'New Chat') {
      onNewChat();
      onClose();
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
        {
          text: 'Logout',
          onPress: async () => {
            try {
              await signOut(auth);
              await GoogleSignin.signOut();
              dispatch(logout());
              onClose();
            } catch (error) {
              console.error('Logout Error:', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const menuItems = [
    { name: 'Settings', icon: 'settings-outline' },
    { name: 'Logout', icon: 'log-out-outline' },
  ];

  const renderHeader = () => (
    <TouchableOpacity
      style={styles.header}
      onPress={() => handleMenuItemPress('New Chat')}
    >
      <Text style={styles.headerText}>New Chat</Text>
    </TouchableOpacity>
  );

  const renderFooter = () => (
    <View style={styles.footer}>
      <View >
        {menuItems.map((item) => (
          <View key={item.name}>
            <TouchableOpacity
              style={[
                styles.menuItem,
                item.name === 'Settings' &&
                  isSettingsExpanded &&
                  styles.activeMenuItem,
              ]}
              onPress={() => handleMenuItemPress(item.name)}
            >
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
                    console.log('Saving setting:', numTokens);
                    setIsSettingsExpanded(false);
                  }}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
      </View>
      <View style={styles.profileContainer}>
        <View style={styles.profileInfo}>
          {userInfo?.photoUrl ? (
            <Image
              source={{ uri: userInfo.photoUrl }}
              style={styles.profileIcon}
            />
          ) : (
            <Ionicons name="person-outline" size={24} color="#333" />
          )}
          <View style={styles.profileTextContainer}>
            <Text style={styles.profileName}>
              Welcome, {userInfo?.name || 'User'}!
            </Text>
            <Text style={styles.profileEmail}>
              {userInfo?.email || 'No email'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <Modal visible={visible} transparent animationType="none">
        <View style={styles.loaderContainer}>
          <LottieView
            source={require('../../assets/animation/lottie.json')}
            autoPlay
            loop
            style={styles.animation}
          />
          <Text style={styles.loaderText}>Loading...</Text>
        </View>
      </Modal>
    );
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[styles.menuContainer, { transform: [{ translateX }] }]}
        >
          <View style={styles.container}>
            {renderHeader()}
            <View style={styles.chatListContainer}>
              <ChatList
                onChatSelected={onClose}
                chats={chats}
              />
            </View>
            {renderFooter()}
          </View>
        </Animated.View>
        <TouchableOpacity
          style={styles.overlayButton}
          onPress={onClose}
          activeOpacity={1}
        />
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
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  header: {
    backgroundColor: '#1a237e',
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  headerText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  chatListContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  footer: {
    backgroundColor: '#F5F7FB',
  },
  menuContent: {
  },
  profileContainer: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  profileTextContainer: {
    marginLeft: 10,
    flex: 1,
  },
  profileName: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  profileEmail: {
    fontSize: 12,
    color: '#777',
    marginTop: 2,
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  loaderText: {
    marginTop: 20,
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  animation: {
    width: 200,
    height: 200,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 10,
  },
});

export default SideMenu;