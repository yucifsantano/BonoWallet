import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, View, ActivityIndicator, StyleSheet } from 'react-native';

import { CustomText } from './CustomText';
import { active, greySecondary } from '../styles/color.theme';

export function CustomButton({
  loading,
  type,
  children,
  disabled,
  isLarge,
  style,
  textSize,
  textStyle,
  textColor,
  onPress,
  Icon,
  iconPosition,
}) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        type === "transparent" ? styles.transparentBtn : styles.filledBtn,
        { minWidth: isLarge ? 160 : 110 },
        style,
        disabled ? { backgroundColor: greySecondary } : {},
      ]}
      disabled={disabled || loading}
      onPress={onPress}
    >
      {!!Icon && (iconPosition === "left") &&  (
        <View style={[styles.icon, { paddingRight: !!children ? 12 : 0, }]}>
          {Icon}
        </View>
      )}
      {
        children && (
          <CustomText
            size={textSize}
            type={"bold"}
            color={textColor ? textColor : (type === "transparent") ? "greySecondary" : "textWhite"}
            align={"center"}
            style={textStyle}
          >
            {children}
          </CustomText>
        )
      }
      {!!Icon && (iconPosition === "right") &&  (
        <View style={[styles.icon, { paddingLeft: !!children ? 12 : 0, }]}>
          {Icon}
        </View>
      )}
      {
        loading && (
          <View style={[
            styles.loaderContainer,
            { backgroundColor: type === "transparent" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.5)" },
          ]}>
            <ActivityIndicator color={active} size={"large"} />
          </View>
        )
      }
    </TouchableOpacity>
  );
}

CustomButton.propTypes = {
  loading: PropTypes.bool,
  type: PropTypes.oneOf(["filled", "transparent"]),
  disabled: PropTypes.bool,
  isLarge: PropTypes.bool,
  style: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.object), PropTypes.object]),
  textSize: PropTypes.number,
  textStyle: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.object), PropTypes.object]),
  textColor: PropTypes.string,
  iconPosition: PropTypes.oneOf(["left", "right"]),
  onPress: PropTypes.func.isRequired,
};

CustomButton.defaultProps = {
  loading: false,
  type: "filled",
  disabled: false,
  isLarge: false,
  style: {},
  textSize: 12,
  textStyle: {},
  textColor: undefined,
  iconPosition: "left",
  onPress: () => {},
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  icon: {

  },
  transparentBtn: {
    backgroundColor: "transparent",
  },
  filledBtn: {
    backgroundColor: active,
  },
  loaderContainer: {
    borderRadius: 10,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});
