import React, { useEffect } from 'react';
import {
  SafeAreaView,
  StatusBar,
  FlatList,
  StyleSheet,
} from 'react-native';
import { useModel } from '../../hooks/useModel';
import { useChat, Message } from '../../hooks/useChat';
import { MessageComponent } from '../../components/messageComponent/MessageComponent';
import { Header } from '../../components/header/Header';
import { ChatInput } from '../../components/chatInput/ChatInput';
import { LoadingScreen } from '../../components/loading/Loading';

const Main = () => {
  const { isDownloaded, isModelLoaded, progress, model } = useModel();
  const {
    messages,
    inputText,
    loading,
    numTokens,
    sendMessage,
    updateInput,
    updateNumTokens,
    flatListRef,
  } = useChat(model);

  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const renderMessage = ({ item }: { item: Message }) => (
    <MessageComponent message={item} role={item.role} />
  );

  if (!isDownloaded) {
    return <LoadingScreen progress={progress} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a237e" />
      <Header loading={loading} />
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderMessage}
        contentContainerStyle={styles.messageList}
      />
      <ChatInput
        inputText={inputText}
        numTokens={numTokens}
        loading={loading}
        onChangeText={updateInput}
        onChangeTokens={updateNumTokens}
        onSend={sendMessage}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },
  messageList: {
    padding: 12,
  },
});

export default Main;