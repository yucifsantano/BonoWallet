import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { lightGrey } from '../styles/color.theme';
import { PAGINATION_HEIGHT } from '../styles/global';
import { deviceSize } from '../sdk/helper';

const { width } = deviceSize;

export function Pagination({ slides, scrollX, style = {} }) {
  const containerStyle = useMemo(
    () => [styles.container, style],
    [style],
  );

  return (
    <Animated.View style={containerStyle}>
      {
        slides.map((item, key) => {
          const paginationAnimatedDot = useAnimatedStyle(
            () => ({
              opacity: interpolate(
                scrollX.value,
                [(key - 1) * width, key * width, (key + 1) * width],
                [0.3, 1, 0.3],
                Extrapolate.CLAMP,
              ),
            })
          );

          const paginationStyle = [styles.paginationDot, paginationAnimatedDot];

          return (
            <Animated.View
              key={key}
              style={paginationStyle}
            />
          )
        })
      }
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    position: "absolute",
    height: PAGINATION_HEIGHT,
    alignItems: "center",
    alignSelf: "center",
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 50,
    marginHorizontal: 3,
    backgroundColor: lightGrey,
  },
})
