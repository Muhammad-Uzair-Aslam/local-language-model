import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './src/store/store';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { getAuth, onAuthStateChanged } from '@react-native-firebase/auth';
import { useDispatch } from 'react-redux';
import { setUser, setLoading } from './src/store/slices/authSlice';
import MainNavigator from './src/navigation/MainNavigator';
import { UserInfo } from './src/types/types';

GoogleSignin.configure({
  webClientId: '978115865811-1m2o145flbp2da3hf8du5kf4t43dt53a.apps.googleusercontent.com',
  offlineAccess: true,
});

const AuthInitializer: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: UserInfo) => {
      dispatch(setLoading(true));
      if (firebaseUser) {
        dispatch(
          setUser({
            email: firebaseUser.email,
            name: firebaseUser.displayName,
            photoUrl: firebaseUser.photoURL,
            uid: firebaseUser.uid,
          })
        );
      } else {
        dispatch(setUser(null));
      }
      dispatch(setLoading(false));
    });

    return () => unsubscribe();
  }, [dispatch]);

  return null;
};

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
          <AuthInitializer />
          <View style={{ flex: 1 }}>
            <MainNavigator />
          </View>
      </PersistGate>
    </Provider>
  );
};

export default App;