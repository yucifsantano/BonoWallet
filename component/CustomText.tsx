import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';

import { active, danger, success, textWhite, textWhite01, greySecondary, greyPrimary, textDisable } from '../styles/color.theme';

export function CustomText({
  type,
  size,
  color,
  style,
  align,
  children,
  ...props
}:{
  type?:any;
  size?:number | any;
  color?:string | any;
  style?:any;
  align?:string | any;
  children?:any;
}) {
  const setFontType = (type) => {
    switch (type) {
      case 'bold':
        return 'Play-Bold';
      case 'regular':
      default:
        return 'Play-Regular';
    }
  };

  const setFontColor = (color) => {
    switch (color) {
      case 'textDisable':
        return textDisable;
      case 'greyPrimary':
        return greyPrimary;
      case 'greySecondary':
        return greySecondary;
      case 'active':
        return active;
      case 'danger':
        return danger;
      case 'success':
        return success;
      case 'white01':
        return textWhite01;
      case 'textWhite':
      default:
        return textWhite;
    }
  }

  return (
    <Text
      {...props}
      style={[
        {
          fontFamily: setFontType(type),
          fontSize: size,
          color: setFontColor(color),
          textAlign: (align === "left" || align === "right" || align === "center") ? align : "auto",
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

CustomText.propTypes = {
  type: PropTypes.oneOf(["bold", "regular"]),
  size: PropTypes.number,
  color: PropTypes.oneOf(["greyPrimary", "greySecondary", "active", "danger", "success", "white01", "textWhite", "textDisable"]),
  style: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.object), PropTypes.object]),
  align: PropTypes.oneOf(["left", "right", "center"]),
};

CustomText.defaultProps = {
  type: "regular",
  size: 14,
  color: "textWhite",
  style: {},
  align: "left",
};
