import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Dimensions, StyleSheet } from 'react-native';
import { Svg, Circle, Path } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const SplashScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const textTranslateY = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const loadingDots = [...Array(3)].map(() => useRef(new Animated.Value(0)).current);
  
  const bubbles = [...Array(20)].map(() => ({
    left: Math.random() * width,
    top: Math.random() * height,
    size: Math.random() * 40 + 10,
    duration: Math.random() * 2000 + 3000,
    delay: Math.random() * 1000,
  }));

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Main animations
    Animated.parallel([
      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      // Scale
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      // Text slide up and fade in
      Animated.timing(textTranslateY, {
        toValue: 0,
        duration: 800,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Loading dots animation
    const animateLoadingDots = () => {
      const animations = loadingDots.map((dot, i) =>
        Animated.sequence([
          Animated.delay(i * 200),
          Animated.spring(dot, {
            toValue: 1,
            friction: 3,
            useNativeDriver: true,
          }),
          Animated.spring(dot, {
            toValue: 0,
            friction: 3,
            useNativeDriver: true,
          }),
        ])
      );

      Animated.loop(
        Animated.stagger(200, animations)
      ).start();
    };

    animateLoadingDots();
  }, []);

  const BubbleComponent = ({ style }) => {
    const bubbleAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(bubbleAnim, {
            toValue: -100,
            duration: style.duration,
            delay: style.delay,
            useNativeDriver: true,
          }),
          Animated.timing(bubbleAnim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }, []);

    return (
      <Animated.View
        style={[
          styles.bubble,
          {
            left: style.left,
            top: style.top,
            width: style.size,
            height: style.size,
            transform: [{ translateY: bubbleAnim }],
          },
        ]}
      />
    );
  };

  return (
    <View style={styles.container}>
      {/* Background bubbles */}
      {bubbles.map((bubble, index) => (
        <BubbleComponent key={index} style={bubble} />
      ))}

      {/* Main content */}
      <Animated.View
        style={[
          styles.contentContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Logo with pulsing shadow */}
        <View style={styles.logoContainer}>
          <Animated.View
            style={[
              styles.logoShadow,
              {
                transform: [{ scale: pulseAnim }],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.logoPulse,
              {
                transform: [{ scale: pulseAnim }],
              },
            ]}
          />
          <View style={styles.logoInner}>
            <Svg width={64} height={64} viewBox="0 0 24 24" fill="white">
              <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
              <Path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
            </Svg>
          </View>
        </View>

        {/* Text with slide up animation */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: textTranslateY }],
          }}
        >
          <Text style={styles.title}>DeepSeek</Text>
          <Text style={styles.subtitle}>Explore the depths</Text>
        </Animated.View>

        {/* Loading dots */}
        <View style={styles.loadingContainer}>
          {loadingDots.map((dot, index) => (
            <Animated.View
              key={index}
              style={[
                styles.loadingDot,
                {
                  transform: [
                    {
                      scale: dot,
                    },
                  ],
                },
              ]}
            />
          ))}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#172554', // blue-950
  },
  bubble: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(147, 197, 253, 0.1)', // blue-300 with opacity
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: 128,
    height: 128,
    marginBottom: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoShadow: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 999,
    backgroundColor: 'transparent',
    shadowColor: '#3B82F6',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
  },
  logoPulse: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 999,
    backgroundColor: 'rgba(59, 130, 246, 0.2)', // blue-500 with opacity
  },
  logoInner: {
    width: '75%',
    height: '75%',
    borderRadius: 999,
    backgroundColor: 'rgb(59, 130, 246)', // blue-500
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: 'rgb(191, 219, 254)', // blue-200
    marginBottom: 32,
    textAlign: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  loadingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgb(96, 165, 250)', // blue-400
    marginHorizontal: 4,
  },
});

export default SplashScreen;