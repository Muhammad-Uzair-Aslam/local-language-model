import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { setActiveChat, deleteChat } from '../../store/slices/chatSlice';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHook';
import { Message } from '../../hooks/useChat';

interface ChatItem {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  userId: string;
}

interface ChatListProps {
  onChatSelected: () => void;
  ListHeaderComponent?: React.ReactElement;
  chats: ChatItem[];
}

const ChatList: React.FC<ChatListProps> = ({
  onChatSelected,
  ListHeaderComponent,
  chats,
}) => {
  const dispatch = useAppDispatch();
  const activeChatId = useAppSelector((state) => state.chat.activeChatId);

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  const handleChatPress = (chatId: string) => {
    dispatch(setActiveChat(chatId));
    onChatSelected();
  };

  const handleDeleteChat = (chatId: string) => {
    Alert.alert(
      'Delete Chat',
      'Are you sure you want to delete this chat?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => dispatch(deleteChat(chatId)),
        },
      ],
      { cancelable: true }
    );
  };

  const renderChatItem = ({ item }: { item: ChatItem }) => (
    <TouchableOpacity
      style={[
        styles.chatItem,
        activeChatId === item.id && styles.activeChatItem,
      ]}
      onPress={() => handleChatPress(item.id)}
    >
      <View style={styles.chatInfo}>
        <Ionicons name="chatbubble-outline" size={20} color="#333" />
        <View style={styles.chatTextContainer}>
          <Text style={styles.chatTitle} numberOfLines={1} ellipsizeMode="tail">
            {item.title}
          </Text>
          <Text style={styles.chatDate}>{formatDate(item.createdAt)}</Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => handleDeleteChat(item.id)}
        style={styles.deleteButton}
      >
        <Ionicons name="trash-outline" size={20} color="#777" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {chats.length > 0 ? (
        <FlatList
          data={chats}
          renderItem={renderChatItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.chatList}
          ListHeaderComponent={ListHeaderComponent}
        />
      ) : (
        <Text style={styles.noChatsText}>No chats yet</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatList: {
    paddingBottom: 20,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    justifyContent: 'space-between',
  },
  activeChatItem: {
    backgroundColor: '#E3F2FD',
  },
  chatInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  chatTextContainer: {
    marginLeft: 10,
    flex: 1,
  },
  chatTitle: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  chatDate: {
    fontSize: 12,
    color: '#777',
    marginTop: 2,
  },
  deleteButton: {
    padding: 5,
  },
  noChatsText: {
    textAlign: 'center',
    color: '#777',
    marginTop: 20,
  },
});

export default ChatList;