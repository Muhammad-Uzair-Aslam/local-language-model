import { GoogleSignin } from '@react-native-google-signin/google-signin';
import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  GestureResponderEvent,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { getApp } from '@react-native-firebase/app';
import LottieView from 'lottie-react-native';
import { useUser } from '../../context/UserContext';

interface FormProps {
  onLoginPress?: (event: GestureResponderEvent) => void;
  onForgotPasswordPress?: (event: GestureResponderEvent) => void;
  onSignUpPress?: (event: GestureResponderEvent) => void;
  onAppleLoginPress?: (event: GestureResponderEvent) => void;
}

const LoginScreen: React.FC<FormProps> = ({
  onLoginPress,
  onForgotPasswordPress,
  onSignUpPress,
  onAppleLoginPress,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { setUserInfo } = useUser(); // Add this line to use the context


  const onGoogleLoginPress = async () => {
    try {
      setIsLoading(true);
      console.log('Checking Google Play Services...');
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

      console.log('Signing in with Google...');
      const userInfo = await GoogleSignin.signIn();
      console.log('User Info:', userInfo);

      const idToken = userInfo?.data?.idToken;
      if (!idToken) {
        throw new Error('Google Sign-In failed: idToken is missing.');
      }

      console.log('Generating Google credential...');
      const app = getApp();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      console.log('Signing in with Firebase...');
      const userCredential = await auth(app).signInWithCredential(googleCredential);
      console.log('User signed in successfully:', userCredential);
      const user = userCredential.user;
      setUserInfo({
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        uid: user.uid
      });
      return userCredential;
    } catch (error:any) {
      console.error('Google Sign-In Error:', error);
      Alert.alert('Error', `Google Sign-In failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '978115865811-1m2o145flbp2da3hf8du5kf4t43dt53a.apps.googleusercontent.com', 
    });
  }, []);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loaderContainer]}>
        <LottieView
                source={require('../../assets/animation/lottie.json')} // Add your Lottie JSON file in the project
                autoPlay
                loop
                style={styles.animation}
              />
        <Text style={styles.loaderText}>Signing in with Google...</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity onPress={onForgotPasswordPress}>
          <Text style={styles.pageLink}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.formButton} onPress={onLoginPress}>
          <Text style={styles.formButtonText}>Log in</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.signUpLabel}>
        Don't have an account?{' '}
        <Text style={styles.signUpLink} onPress={onSignUpPress}>
          Sign up
        </Text>
      </Text>
      <View style={styles.socialButtonsContainer}>
      
        <TouchableOpacity 
          style={[styles.socialButton, styles.googleButton]} 
          onPress={onGoogleLoginPress}
        >
          <FontAwesome name="google" size={18} color="black" />
          <Text style={[styles.socialButtonText, styles.googleButtonText]}>
            Log in with Google
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 500,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 10,
  },
  loaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 20,
    color: 'blue',
    fontSize: 16,
    fontWeight: '600',
  },
  animation:{
  width:200,
  height:200
  },
  title: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 30,
  },
  form: {
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#c0c0c0',
    borderRadius: 20,
    padding: 12,
    marginBottom: 18,
  },
  pageLink: {
    marginBottom: 10,
    textAlign: 'right',
    color: '#747474',
    textDecorationLine: 'underline',
    fontSize: 12,
  },
  formButton: {
    backgroundColor: 'teal',
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.24,
    shadowRadius: 8,
    elevation: 5,
  },
  formButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  signUpLabel: {
    textAlign: 'center',
    fontSize: 12,
    color: '#747474',
    marginTop: 15,
  },
  signUpLink: {
    color: 'teal',
    fontWeight: '800',
    textDecorationLine: 'underline',
  },
  socialButtonsContainer: {
    marginTop: 20,
    flexDirection: 'column',
    gap: 15,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    borderRadius: 20,
    padding: 10,
    marginBottom: 15,
  },
  socialButtonText: {
    color: 'white',
    marginLeft: 8,
    fontWeight: 'bold',
  },
  googleButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#747474',
  },
  googleButtonText: {
    color: '#000',
  },
});

export default LoginScreen;

    
