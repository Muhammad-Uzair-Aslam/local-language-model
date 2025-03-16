import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import LottieView from 'lottie-react-native';

export interface ChatInputProps {
  inputText: string;
  loading: boolean;
  onChangeText: (text: string) => void;
  onSend: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  inputText,
  loading,
  onChangeText,
  onSend,
}) => (
  <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
  >
    <View style={styles.inputContainer}>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Chat with me..."
          placeholderTextColor="#999"
          value={inputText}
          onChangeText={onChangeText}
          multiline
          maxLength={1000}
        />
      </View>
      <TouchableOpacity
        style={[styles.sendButton, loading && styles.sendButtonDisabled]}
        onPress={onSend}
        disabled={loading}
      >
        {loading ? (
          <LottieView
            source={require('../../assets/animation/animation2.json')}
            autoPlay
            loop
            style={styles.animation}
          />
        ) : (
          <Text style={styles.sendButtonText}>Send</Text>
        )}
      </TouchableOpacity>
    </View>
  </KeyboardAvoidingView>
);

// Styles remain unchanged
export const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: '#F5F7FB',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 2,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  input: {
    fontSize: 16,
    color: '#333',
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#1a237e',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#B0C4DE',
  },
  sendButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  animation: {
    width: 30,
    height: 30,
  },
});