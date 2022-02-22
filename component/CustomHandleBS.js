import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';

import { active07 } from '../styles/color.theme';

export function CustomHandleBS({
  containerHeight,
  withBorder,
  Icon,
}) {
  return (
    <View style={[
      styles.container,
      withBorder ? styles.bordered : {},
      { height: containerHeight },
    ]}>
      {Icon}
    </View>
  );
}

CustomHandleBS.propTypes = {
  containerHeight: PropTypes.number,
  withBorder: PropTypes.bool,
  Icon: PropTypes.element,
};

CustomHandleBS.defaultProps = {
  containerHeight: 60,
  withBorder: true,
  Icon: null,
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  bordered: {
    borderRadius: 1,
    borderBottomColor: active07,
    borderBottomWidth: 2,
  },
});
