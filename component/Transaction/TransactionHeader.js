import React from 'react';
import { View, StyleSheet } from 'react-native';

import { CustomText } from '../CustomText';

export function TransactionHeader({ title }) {
  return (
    <View style={styles.sectionHeader}>
      <CustomText
        size={12}
        color={"greyPrimary"}
      >
        {title}
      </CustomText>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    alignItems: "center",
  },
});
