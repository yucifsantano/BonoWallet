import React from 'react';
import PropTypes from 'prop-types';
import { useHeaderHeight } from '@react-navigation/elements';
import { TouchableOpacity, StyleSheet, Platform } from 'react-native';

import { CustomText } from './CustomText';
import { BackArrow } from './Icons';
import { StatusBarHeight } from '../sdk/helper';

export function BackNavigation({ title, navigation, style, ...props }) {
  const headerHeight = useHeaderHeight();

  const handleGoBack = () => navigation.goBack();

  return (
    <TouchableOpacity
      style={[styles.container, { height: Platform.OS === "ios" ? headerHeight : headerHeight - StatusBarHeight }, style]}
      onPress={handleGoBack}
    >
      <BackArrow color={props.tintColor} />
      <CustomText
        size={16}
        color={"active"}
        style={{ marginLeft: 6 }}
      >
        {title}
      </CustomText>
    </TouchableOpacity>
  )
}

BackNavigation.propTypes = {
  title: PropTypes.string,
  navigation: PropTypes.object.isRequired,
};

BackNavigation.defaultProps = {
  title: "",
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 6,
  },
});
