import React from 'react';
import { ImageBackground, StyleSheet, Platform } from 'react-native';

import TabNavigatorBgImage from '../assets/backgroundImage.png';
import { deviceSize, StatusBarHeight } from '../sdk/helper';

const { height, width } = deviceSize;

export function TabFullScreenBackgroundImage({ children }) {
  return (
    <ImageBackground
      source={TabNavigatorBgImage}
      resizeMode={"cover"}
      style={styles.background}
    >
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: width,
    height: height,
    paddingTop: Platform.OS === "android" ? StatusBarHeight : 0,
  },
});
