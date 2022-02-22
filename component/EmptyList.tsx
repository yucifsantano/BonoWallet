import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

import { CustomText } from './CustomText';
import ImageSource from '../assets/slideImage1.png';
import { deviceSize } from '../sdk/helper';

const { width } = deviceSize;

export function EmptyList({ text, containerStyle, imageStyle, textStyle }) {
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.imageContainer}>
        <Animated.Image
          source={ImageSource}
          style={[styles.imageStyle, imageStyle]}
        />
      </View>

      <CustomText
        size={16}
        color={'greyPrimary'}
        align={'center'}
        style={textStyle}
      >
        {text}
      </CustomText>
    </View>
  );
}

EmptyList.propTypes = {
  text: PropTypes.string,
  containerStyle: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.object), PropTypes.object]),
  imageStyle: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.object), PropTypes.object]),
  textStyle: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.object), PropTypes.object]),
};

EmptyList.defaultProps = {
  text: "",
  containerStyle: null,
  imageStyle: null,
  textStyle: null,
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 21,
  },
  imageContainer: {
    width: width - 42,
    marginBottom: 12,
    alignItems: "center",
  },
  imageStyle: {
    width: "100%",
    resizeMode: "contain",
  },
});
