import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import  Ionicons  from 'react-native-vector-icons/Ionicons';

interface HeaderProps {
  loading: boolean;
  onMenuPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ loading, onMenuPress }) => (
  <View style={styles.header}>
    <View style={styles.leftContainer}>
      <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
        <Ionicons name="menu" size={24} color="#FFF" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>AI Assistant</Text>
    </View>
    {loading && <ActivityIndicator size="small" color="#FFF" />}
  </View>
);

export const styles = StyleSheet.create({
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
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButton: {
    marginRight: 16,
    padding: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFF',
    letterSpacing: 1,
  },
});