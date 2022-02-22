import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';

import { Card } from './Card';
import { ProgressBar } from './ProgressBar';
import {
  ACTIONS_BOX_HEIGHT,
  HEIGHT_OF_CARD_CONTENT,
  HEIGHT_OF_PROGRESSBAR,
  WIDTH_OF_PROGRESSBAR,
  CARD_HEIGHT,
} from '../styles/global';
import { getStyle, StatusBarHeight } from '../sdk/helper';

export function CardSheet({
  currentIndex,
  scrollX,
  paginationIndex,
  goToSlide,
}) {
  const progressBarWrapperAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      currentIndex.value,
      [0, 0.5],
      [1, 0],
      Extrapolate.CLAMP,
    ),
    top: interpolate(
      currentIndex.value,
      [0, 1],
      [StatusBarHeight * 3 + CARD_HEIGHT, -ACTIONS_BOX_HEIGHT],
      Extrapolate.CLAMP,
    ),
  }));

  const progressBarWrapperStyle = getStyle(styles.progressBarWrapper, progressBarWrapperAnimatedStyle, progressBarWrapperAnimatedStyle);

  return (
    <View style={styles.container}>
      <Card
        scrollX={scrollX}
        paginationIndex={paginationIndex}
        goToSlide={goToSlide}
      />

      <Animated.View style={progressBarWrapperStyle}>
        <ProgressBar
          width={WIDTH_OF_PROGRESSBAR}
          height={HEIGHT_OF_PROGRESSBAR}
          percent={0.4}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: HEIGHT_OF_CARD_CONTENT,
    alignItems: "center",
  },
  progressBarWrapper: {
    bottom: 0,
    position: "absolute",
    height: ACTIONS_BOX_HEIGHT,
    width: "100%",
  }
});
