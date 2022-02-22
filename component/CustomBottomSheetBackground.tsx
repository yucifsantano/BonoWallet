import React from 'react';
import { View } from 'react-native';

import { dark, darkGrey } from '../styles/color.theme';

export function CustomBottomSheetBackground({ style }) {
  return (
    <View
      style={[
        {
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
          borderWidth: 1,
          borderColor: darkGrey,
          backgroundColor: dark,
          marginHorizontal: 0.5,
        },
        { ...style },
      ]}
    />
  );
}
