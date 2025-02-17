import React, { useState,useEffect } from 'react';
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
import SideMenu from '../../components/sideMenu/SideMenu';
import SettingsScreen from '../settingsScreen/SettingsScreen';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../types/types';
import  { NativeStackNavigationProp } from '@react-navigation/native-stack';
type navigationProp=NativeStackNavigationProp<RootStackParamList>;
const Main = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const { isDownloaded, progress, model } = useModel();
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
const navigation=useNavigation<navigationProp>()
  const handleNavigate = (screen: string) => {
    if (screen === 'Settings') {
      navigation.navigate('Setting'); 
    }
    console.log(`Navigating to ${SettingsScreen}`);
  };

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
      <Header 
        loading={loading} 
        onMenuPress={() => setMenuVisible(true)} 
      />
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderMessage}
        contentContainerStyle={styles.messageList}
      />
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