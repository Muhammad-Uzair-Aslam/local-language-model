import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StatusBar,
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { useModel } from '../../hooks/useModel';
import { useChat, Message } from '../../hooks/useChat';
import { MessageComponent } from '../../components/messageComponent/MessageComponent';
import { Header } from '../../components/header/Header';
import { ChatInput } from '../../components/chatInput/ChatInput';
import { LoadingScreen } from '../../components/loading/Loading';
import SideMenu from '../../components/sideMenu/SideMenu';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../types/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { createNewChat, setCurrentUser } from '../../store/slices/chatSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHook';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Main = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useAppDispatch();
  const activeChatId = useAppSelector((state) => state.chat.activeChatId);
  const allChats = useAppSelector((state) => state.chat.chats) || [];
  const currentUserId = useAppSelector((state) => state.chat.currentUserId);
  const authUser = useAppSelector((state) => state.auth.user);

  // Filter chats for the current user
  const chats = allChats.filter(chat => chat.userId === currentUserId);

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
  } = useChat(model, activeChatId); // Pass activeChatId to useChat

  // Sync currentUserId with authUser
  useEffect(() => {
    if (authUser && authUser.uid !== currentUserId) {
      dispatch(setCurrentUser(authUser.uid));
    }
  }, [authUser, currentUserId, dispatch]);

  // Create a new chat if there are no chats for the current user
  useEffect(() => {
    if (currentUserId && chats.length === 0 && !activeChatId) {
      dispatch(createNewChat());
    }
  }, [chats.length, activeChatId, currentUserId, dispatch]);

  const handleNavigate = (screen: string) => {
    if (screen === 'Settings') {
      navigation.navigate('Setting');
    }
  };

  const handleNewChat = () => {
    dispatch(createNewChat());
  };

  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const renderMessage = ({ item }: { item: Message }) => (
    <MessageComponent message={item} role={item.role} />
  );

  const renderEmptyChat = () => (
    <View style={styles.emptyChatContainer}>
      <Text style={styles.emptyChatText}>Send a message to start a new chat</Text>
    </View>
  );

  if (!authUser) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Please log in to view your chats</Text>
      </View>
    );
  }

  if (!isDownloaded) {
    return <LoadingScreen progress={progress} />;
  }

  if (!isModelLoaded) {
    return <LoadingScreen progress={100} message="Loading AI Model..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a237e" />
      <Header loading={loading} onMenuPress={() => setMenuVisible(true)} />
      {messages?.length === 0 ? (
        renderEmptyChat()
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderMessage}
          contentContainerStyle={styles.messageList}
        />
      )}
      <ChatInput
        inputText={inputText}
        loading={loading}
        onChangeText={updateInput}
        onSend={sendMessage}
      />
      <SideMenu
        onChangeTokens={updateNumTokens}
        numTokens={numTokens}
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onNavigate={handleNavigate}
        onNewChat={handleNewChat}
        chats={chats}
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
  emptyChatContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyChatText: {
    fontSize: 16,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Main;