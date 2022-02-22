import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, View, StyleSheet } from 'react-native';

import { CustomText } from './CustomText';
import { ArrowRightIcon } from './Icons';
import { greySecondary, lightDark } from '../styles/color.theme';
import { navigate } from '../sdk/helper';

export function GoToButton({
  to,
  navigationParams,
  disabled,
  style,
  Icon,
  textSize,
  children,
  onPress,
}) {
  const handlePress = () => {
    if (onPress) {
      onPress();
    }

    if (to) {
      navigate(to, navigationParams);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        style,
        { backgroundColor: disabled ? greySecondary : lightDark },
      ]}
      disabled={disabled}
      onPress={handlePress}
    >
      <View style={styles.leftPart}>
        {!!Icon && (
          <View style={[styles.leftPartIcon, { paddingRight: !!children ? 12 : 0 }]}>
            {Icon}
          </View>
        )}
        {
          children && (
            <CustomText
              size={textSize}
              color={"textWhite"}
              align={"center"}
            >
              {children}
            </CustomText>
          )
        }
      </View>

      <View style={[{ paddingLeft: !!children ? 12 : 0 }]}>
        <ArrowRightIcon />
      </View>
    </TouchableOpacity>
  );
}

GoToButton.propTypes = {
  to: PropTypes.string,
  disabled: PropTypes.bool,
  style: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.object), PropTypes.object]),
  textSize: PropTypes.number,
  onPress: PropTypes.func.isRequired,
};

GoToButton.defaultProps = {
  to: null,
  disabled: false,
  style: {},
  textSize: 16,
  onPress: () => {},
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 10,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "space-between",
    height: 48,
    width: "100%",
    flexDirection: "row",
    marginBottom: 12,
  },
  leftPart: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    height: "100%",
  },
  leftPartIcon: {
    alignItems: "center",
    width: 42,
    justifyContent: "center",
  },
});
