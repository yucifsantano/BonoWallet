import React from 'react';
import { TouchableOpacity, Pressable, View, StyleSheet, ActivityIndicator } from 'react-native';

import { Circle } from './CircleBtn';
import { CustomText } from './CustomText';
import { WalletIcon, CheckIcon, ThreeVerticalDots } from './Icons';
import { lightDark, active, dark, greyPrimary } from '../styles/color.theme';
import { deviceSize } from '../sdk/helper';

const { width } = deviceSize;
const VERTICAL_PADDING = 18;
const CIRCLE_SIZE = 45;
const HEIGHT_OF_CONTAINER = VERTICAL_PADDING * 2 + CIRCLE_SIZE;
const EDIT_BUTTON_WIDTH = 48;

export function WalletItem({ item, chosenItem, loading, index, onItemPress, onActionPress }) {
  const handleItemPress = () => {
    onItemPress(item);
  };

  const handleActionPress = () => {
    onActionPress(item);
  };

  return (
    <Pressable
      style={styles.container}
      onPress={handleItemPress}
    >
      <Circle
        Icon={WalletIcon}
        iconColor={active}
        size={CIRCLE_SIZE}
        contentSize={23}
        badge={chosenItem ? <CheckIcon /> : (index === 0 && loading) ? <ActivityIndicator color={"white"} size={16} /> : null}
        style={styles.circleWrapper}
      />
      <View style={styles.walletName}>
        <CustomText
          size={16}
          type={'bold'}
          style={{ letterSpacing: 1.115 }}
          numberOfLines={1}
        >
          {item.name}
        </CustomText>
        <CustomText
          size={12}
          color={"greyPrimary"}
          numberOfLines={1}
        >
          Cartera de múltiples monedas
        </CustomText>
      </View>
      <TouchableOpacity
        style={styles.editAction}
        onPress={handleActionPress}
      >
        <ThreeVerticalDots />
      </TouchableOpacity>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: lightDark,
    width: "100%",
    paddingVertical: VERTICAL_PADDING,
    marginBottom: 18,
    borderRadius: 10,
    height: HEIGHT_OF_CONTAINER,
  },
  circleWrapper: {
    marginHorizontal: 12,
  },
  walletName: {
    justifyContent: "center",
    // comment: outer padding - 18 * 2, circle margin - 12 * 2, border width - 2;
    width: width - CIRCLE_SIZE - EDIT_BUTTON_WIDTH - 36 - 24 - 2,
    height: HEIGHT_OF_CONTAINER,
    paddingRight: 12,
  },
  editAction: {
    width: EDIT_BUTTON_WIDTH,
    height: HEIGHT_OF_CONTAINER,
    justifyContent: "center",
    alignItems: "center",
    borderLeftColor: dark,
    borderLeftWidth: 2
  },
});

