import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { getApp } from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import SplashScreen from '../screens/splashScreen/SplashScreen';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

const MainNavigator = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  useEffect(() => {
    const app = getApp();
    const splashTimer = setTimeout(() => {
      setIsSplashVisible(false);
    }, 3000);

    const subscriber = auth(app).onAuthStateChanged((user) => {
      setUser(user);
      if (initializing) setInitializing(false);
    });

    return () => {
      clearTimeout(splashTimer);
      subscriber();
    };
  }, [initializing]);

  if (isSplashVisible) {
    return <SplashScreen />;
  }

  if (initializing) return null;

  return (
    <NavigationContainer>
      {user ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default MainNavigator;