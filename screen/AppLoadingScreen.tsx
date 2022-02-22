import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { View, ActivityIndicator, StyleSheet, Image, Animated, Platform } from 'react-native';

import { CustomText } from '../component/CustomText';
import { StatusBarHeight, deviceSize } from '../sdk/helper';
import { active, dark } from '../styles/color.theme';
import AreYouAgreeImage from '../assets/areYouAgreeImage.png';

const { width, height } = deviceSize;

const Dot = ({ active }) => {
  const opacityValue = useRef(new Animated.Value(1)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (active) {
      showAnimation();
    } else {
      hideAnimation();
    }
  }, [active]);

  const showAnimation = () => {
    Animated.timing(opacityValue, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true
    }).start();

    Animated.timing(scaleValue, {
      toValue: 1.2,
      duration: 500,
      useNativeDriver: true
    }).start();
  };

  const hideAnimation = () => {
    Animated.timing(opacityValue, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true
    }).start();

    Animated.timing(scaleValue, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true
    }).start();
  };

  return (
    <Animated.View style={[{ opacity: opacityValue, transform: [{ scale: scaleValue }] }]}>
      <CustomText
        size={16}
        style={{ lineHeight: 16, marginHorizontal: 1 }}
        color={'active'}
        type={'bold'}
      >
        &#46;
      </CustomText>
    </Animated.View>
  );
};

export function AppLoadingScreen() {
  const [activeDot, setActiveDot] = useState(1)
  const checkNetworkLoading = useSelector(state => state.app.checkNetworkLoading);
  const walletsLoading = useSelector(state => state.wallet.walletsLoading);
  const secureChecking = useSelector(state => state.app.secureChecking);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDot(activeDot > 2 ? 1 : activeDot + 1);
    }, 500);

    return () => clearInterval(interval);
  });

  const getLoadingText = () => {
    if (checkNetworkLoading) {
      return "Comprobando el servidor";
    } else if (secureChecking || walletsLoading) {
      return "Comprobando datos locales";
    }
  }

  return (
    <View style={[styles.container]}>
      <View style={styles.imageContainer}>
        <Image
          source={AreYouAgreeImage}
          style={styles.imageStyle}
        />
      </View>
      <View style={styles.content}>
        <ActivityIndicator
          size={"large"}
          color={active}
        />
        <View style={styles.labelContainer}>
          <CustomText
            type={'bold'}
            size={16}
            style={{ lineHeight: 16 }}
            color={'active'}
          >
            {getLoadingText()}
          </CustomText>
          <View style={styles.dotsContainer}>
            {[1, 2, 3].map(dot => (
              <Dot key={dot} active={dot === activeDot} />
            ))}
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: Platform.OS === "android" ? StatusBarHeight : 0,
    backgroundColor: dark,
  },
  imageContainer: {
    width: width,
    marginBottom: 18,
  },
  imageStyle: {
    width: width,
    height: height * 0.7,
    resizeMode: "contain",
  },
  content: {
    height: height * 0.3,
    width: width,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  labelContainer: {
    marginTop: 18,
    flexDirection: 'row',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginLeft: 2,
  },
});
