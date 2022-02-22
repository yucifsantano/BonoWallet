import React from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { SvgUri } from 'react-native-svg';

import { active, greySecondary, textWhite } from '../styles/color.theme';
import { CustomText } from './CustomText';
import Shadow from '../assets/grayShadow.png';

const DEFAULT_SIZE = 50;
const DEFAULT_CONTENT_SIZE = 33;

// shadow top offset x = -1, blur = 3
// shadow bottom offset x = 5, blur = 10
// circle image origin size = 40
const SHADOW_SIZE_COEFFICIENT = 1.475; // (origin size + sum of both offsets) / origin size
const SHADOW_TRANSLATE_COEFFICIENT = 0.068; // sum of top offsets / origin size

export function Circle({
  withShadow,
  size,
  Icon,
  disabled,
  contentSize,
  imageSource,
  svgUri,
  style,
  iconColor,
  badge,
  children,
}) {
  return (
    <View style={[
      styles.circle,
      { width: size, height: size, borderRadius: size / 2 },
      style,
    ]}>
      {withShadow && (
        <Image
          style={[
            styles.shadow,
            {
              width: size * SHADOW_SIZE_COEFFICIENT,
              height: size * SHADOW_SIZE_COEFFICIENT,
              transform: [
                { translateY: -size * SHADOW_SIZE_COEFFICIENT * SHADOW_TRANSLATE_COEFFICIENT },
                { translateX: -size * SHADOW_SIZE_COEFFICIENT * SHADOW_TRANSLATE_COEFFICIENT },
              ],
            },
          ]}
          source={Shadow}
        />
      )}
      {!!Icon && <Icon color={disabled ? greySecondary : iconColor} size={contentSize} />}
      {!!imageSource && <Image style={{ resizeMode: "contain", width: contentSize, height: contentSize }} source={imageSource} />}
      {!!svgUri && <SvgUri uri={svgUri} width={contentSize} height={contentSize} />}
      {
        !!badge && (
          <View style={[styles.badge, { zIndex: 3, top: 0, right: 0 }]}>
            {badge}
          </View>
        )
      }
      {
        !!children && (
          <CustomText>{children}</CustomText>
        )
      }
    </View>
  );
}

Circle.propTypes = {
  Icon: PropTypes.func,
  imageSource: PropTypes.any,
  svgUri: PropTypes.string,
  size: PropTypes.number,
  contentSize: PropTypes.number,
  withShadow: PropTypes.bool,
  disabled: PropTypes.bool,
  style: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.object), PropTypes.object]),
  iconColor: PropTypes.string,
  Badge: PropTypes.any,
};

Circle.defaultProps = {
  Icon: null,
  imageSource: null,
  svgUri: null,
  size: DEFAULT_SIZE,
  contentSize: DEFAULT_CONTENT_SIZE,
  withShadow: true,
  disabled: false,
  style: {},
  iconColor: textWhite,
  Badge: null,
};

export function CircleBtn({
  label,
  Icon,
  disabled,
  imageSource,
  style,
  circleStyle,
  badge,
  size,
  contentSize,
  withShadow,
  onPress,
  children,
}) {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      disabled={disabled}
      onPress={onPress}
    >
      <Circle
        withShadow={withShadow}
        size={size}
        Icon={Icon}
        contentSize={contentSize}
        imageSource={imageSource}
        style={[circleStyle]}
        badge={badge}
        disabled={disabled}
      >
        {children}
      </Circle>
      {label && (
        <CustomText
          size={12}
          color={disabled ? 'greySecondary' : 'greyPrimary'}
          align={"center"}
          style={[styles.label]}
          numberOfLines={2}
        >
          {label}
        </CustomText>
      )}
    </TouchableOpacity>
  );
}

CircleBtn.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  Icon: PropTypes.func,
  disabled: PropTypes.bool,
  imageSource: PropTypes.any,
  svgUri: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.object), PropTypes.object]),
  circleStyle: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.object), PropTypes.object]),
  size: PropTypes.number,
  contentSize: PropTypes.number,
  withShadow: PropTypes.bool,
  badge: PropTypes.any,
  onPress: PropTypes.func,
};

CircleBtn.defaultProps = {
  label: null,
  Icon: null,
  disabled: false,
  imageSource: null,
  svgUri: null,
  style: {},
  circleStyle: {},
  size: DEFAULT_SIZE,
  contentSize: DEFAULT_CONTENT_SIZE,
  withShadow: true,
  badge: null,
  onPress: () => {},
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "flex-start",
    position: "relative",
  },
  circle: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  shadow: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  label: {
    marginTop: 6,
  },
  badge: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: active,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
});
