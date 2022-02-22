import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
  withTiming,
} from 'react-native-reanimated';

import { CustomText } from './CustomText';
import { ChangeUp, ChangeDown } from './Icons';
import { darkGrey, active } from '../styles/color.theme';
import { HEIGHT_OF_PROGRESSBAR, WIDTH_OF_PROGRESSBAR } from '../styles/global';

export function ProgressBar({
  width = WIDTH_OF_PROGRESSBAR,
  height = HEIGHT_OF_PROGRESSBAR,
  percent = 0,
}) {
  const activeWidth = useSharedValue(0);

  useEffect(() => {
    if (percent > 1 || percent < 0) return;
    activeWidth.value = withTiming(percent, { duration: 800 });
  }, [percent]);

  const activeWidthAnimated = useAnimatedStyle(() => ({
    width: `${interpolate(
      activeWidth.value,
      [0, 1],
      [0, 100],
      Extrapolate.CLAMP,
    )}%`,
  }));

  return (
    <View style={styles.container}>
      <View style={[styles.progressLine, { height, width }]}>
        <Animated.View style={[StyleSheet.absoluteFill, styles.progressActiveLine, activeWidthAnimated]}/>
      </View>

      <View style={[styles.buySellContainer, { width }]}>
        <View style={[styles.buySellItem]}>
          <View style={styles.labelWrapper}>
            <ChangeUp />
            <CustomText
              style={styles.label}
              color={"greyPrimary"}
              size={12}
            >
              Comprar
            </CustomText>
          </View>
          <CustomText size={12}>{`${percent * 100}%`}</CustomText>
        </View>
        <View style={[styles.buySellItem]}>
          <View style={styles.labelWrapper}>
            <ChangeDown />
            <CustomText
              style={styles.label}
              color={"greyPrimary"}
              size={12}
            >
              Vender
            </CustomText>
          </View>
          <CustomText size={12}>{`${(1 - percent) * 100}%`}</CustomText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  progressLine: {
    borderRadius: 10,
    backgroundColor: darkGrey,
  },
  progressActiveLine: {
    backgroundColor: active,
    borderRadius: 10,
  },
  buySellContainer: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  buySellItem: {
    paddingVertical: 12,
  },
  labelWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    marginHorizontal: 6,
  },
});
