import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import LottieView from 'lottie-react-native';
interface ChatInputProps {
  inputText: string;
  numTokens: string;
  loading: boolean;
  onChangeText: (text: string) => void;
  onChangeTokens: (tokens: string) => void;
  onSend: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  inputText,
  numTokens,
  loading,
  onChangeText,
  onChangeTokens,
  onSend,
}) => (
  <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.tokenInput}
        placeholder="Tokens"
        keyboardType="numeric"
        value={numTokens}
        onChangeText={onChangeTokens}
      />
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
            disabled={loading}>
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
export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F5F7FB',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      backgroundColor: '#1a237e',
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: '#FFF',
      letterSpacing: 1,
    },
    messageList: {
      padding: 12,
    },
    messageContainer: {
      maxWidth: '85%',
      marginVertical: 8,
      padding: 12,
      borderRadius: 20,
    },
    messageTouchable: {
      width: '100%',
    },
    thinkingHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    thinkingHeaderText: {
      fontSize: 14,
      color: '#666',
      fontWeight: '600',
    },
    thinkingContainer: {
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      padding: 8,
      borderRadius: 8,
      marginBottom: 8,
    },
    thinkingText: {
      fontStyle: 'italic',
      color: '#666',
    },
    animation:{width:30,
        height:30
    },
    tokenInput: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: '#ddd',
      padding: 10,
      borderRadius: 20,
    },
    userMessageContainer: {
      alignSelf: 'flex-end',
      backgroundColor: '#1a237e',
      borderBottomRightRadius: 4,
    },
    botMessageContainer: {
      alignSelf: 'flex-start',
      backgroundColor: '#FFF',
      borderBottomLeftRadius: 4,
    },
    messageText: {
      fontSize: 16,
      lineHeight: 24,
    },
    userMessageText: {
      color: '#FFF',
    },
    botMessageText: {
      color: '#333',
    },
    timeText: {
      fontSize: 11,
      marginTop: 4,
      alignSelf: 'flex-end',
    },
    userTimeText: {
      color: '#FFF',
      opacity: 0.8,
    },
    botTimeText: {
      color: '#666',
    },
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
      paddingVertical: 8,
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
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f5f5f5',
    },
    loadingText: {
      marginTop: 16,
      fontSize: 16,
      color: '#666',
    },
  });