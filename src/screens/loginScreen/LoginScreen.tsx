import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  GestureResponderEvent,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
interface FormProps {
  onLoginPress?: (event: GestureResponderEvent) => void;
  onForgotPasswordPress?: (event: GestureResponderEvent) => void;
  onSignUpPress?: (event: GestureResponderEvent) => void;
  onAppleLoginPress?: (event: GestureResponderEvent) => void;
  onGoogleLoginPress?: (event: GestureResponderEvent) => void;
}

const Form: React.FC<FormProps> = ({
  onLoginPress,
  onForgotPasswordPress,
  onSignUpPress,
  onAppleLoginPress,
  onGoogleLoginPress,
}) => {
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
        <TouchableOpacity style={styles.socialButton} onPress={onAppleLoginPress}>
          <FontAwesome name="apple" size={18} color="white" />
          <Text style={styles.socialButtonText}>Log in with Apple</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.socialButton, styles.googleButton]} onPress={onGoogleLoginPress}>
          <FontAwesome name="google" size={18} color="black" />
          <Text style={[styles.socialButtonText, styles.googleButtonText]}>Log in with Google</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 350,
    height: 500,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.35,
    shadowRadius: 15,
    elevation: 10,
  },
  title: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 30,
  },
  form: {
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#c0c0c0',
    borderRadius: 20,
    padding: 12,
    marginBottom: 18,
  },
  pageLink: {
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

export default Form;
