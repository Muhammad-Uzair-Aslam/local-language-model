import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
interface LoadingScreenProps {
  progress: number;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ progress }) => (
    <View style={styles.loadingContainer}>
    <LottieView
      source={require('../../assets/animation/animation2.json')}
      autoPlay
      loop
      style={styles.animation2}
    />
    <Text style={styles.loadingText}>
      Downloading model: {progress.toFixed(2)}%
    </Text>
  </View>
);
const styles = StyleSheet.create({
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
      animation2:{
        width:200,
        height:200
      }
})