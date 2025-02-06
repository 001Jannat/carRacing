import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, PanResponder, Animated } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');

const CarRacingGame = () => {
  const carPosition = useRef(new Animated.Value(width / 2 - 25)).current; 
  const roadAnimation = useRef(new Animated.Value(0)).current;

  // PanResponder to move the car left and right
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const newX = gestureState.dx + width / 2 - 25;
        if (newX >= 0 && newX <= width - 50) {
          carPosition.setValue(newX);
        }
      },
    })
  ).current;

  // Animate the road (background scrolling)
  useEffect(() => {
    Animated.loop(
      Animated.timing(roadAnimation, {
        toValue: height,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* Scrolling Road Background */}
      <Animated.View
        style={[
          styles.road,
          {
            transform: [
              {
                translateY: roadAnimation.interpolate({
                  inputRange: [0, height],
                  outputRange: [0, -height],
                }),
              },
            ],
          },
        ]}
      >
        <Image source={require('./assets/road.png')} style={styles.roadImage} />
        <Image source={require('./assets/road.png')} style={styles.roadImage} />
      </Animated.View>

      {/* Car */}
      <Animated.View
        style={[
          styles.car,
          {
            left: carPosition,
          },
        ]}
        {...panResponder.panHandlers}
      >
        <Image source={require('./assets/car.png')} style={styles.carImage} />
      </Animated.View>

      {/* Score or Timer */}
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>Score: 0</Text>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87CEEB', // Sky blue background
    position: 'relative',
  },
  road: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height * 2,
  },
  roadImage: {
    width: width,
    height: height,
    resizeMode: 'stretch',
  },
  car: {
    position: 'absolute',
    bottom: 50,
    width: 50,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  scoreContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
  },
  scoreText: {
    fontSize: 24,
    color: '#FFF',
  },
});

export default CarRacingGame;