import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { getApp } from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth'
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

const MainNavigator = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  useEffect(() => {
    const app = getApp();
    const subscriber = auth(app).onAuthStateChanged((user) => {
      setUser(user);
      if (initializing) setInitializing(false);
    });
  
    return subscriber;
  }, []);

  if (initializing) return null;

  return (
    <NavigationContainer>
      {user ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default MainNavigator;