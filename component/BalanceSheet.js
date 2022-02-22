import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { setString } from 'expo-clipboard';

import { CircleBtn } from './CircleBtn';
import { CustomText } from './CustomText';
import { CopyIcon, FillUpWalletIcon, SendToWalletIcon, WalletsIcon, ArrowDownIcon } from './Icons';
import { WALLETS_ICON_BOX_HEIGHT, WALLETS_ICON_BOX_MARGIN_TOP, ACTIONS_BOX_HEIGHT, HEIGHT_OF_BALANCE_CONTENT } from '../styles/global';
import { deviceSize, getStyle } from '../sdk/helper';
import { SCREEN_NAMES } from '../styles/constants';

const { width, height } = deviceSize;
const HORIZONTAL_PADDING_BALANCE = width * 0.093;

export function BalanceSheet({ address, balance, putSymbol, currentIndex, navigation }) {
  const [widthOfBalanceString, setWidthOfBalanceString] = useState(0);

  const actionsContainerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      currentIndex.value,
      [0, 0.5],
      [1, 0],
      Extrapolate.CLAMP,
    ),
    transform: [
      {
        translateY: interpolate(
          currentIndex.value,
          [0, 1],
          [0, -(height * 0.2)],
          Extrapolate.CLAMP,
        ),
      }
    ],
  }));

  const animateTextOpacityAndTransform = ({
    withOpacity = true,
    translateYInput = [0, 0.8],
    translateYOutput = [WALLETS_ICON_BOX_HEIGHT / 2, -WALLETS_ICON_BOX_HEIGHT],
    withScale = false,
  }) => useAnimatedStyle(() => ({
    opacity: withOpacity ? interpolate(
      currentIndex.value,
      [0, 0.6],
      [1, 0],
      Extrapolate.CLAMP,
    ) : 1,
    transform: [
      {
        translateX: interpolate(
          currentIndex.value,
          [0, 0.8],
          [0, (width - HORIZONTAL_PADDING_BALANCE - widthOfBalanceString) / 2],
          Extrapolate.CLAMP,
        ),
      },
      {
        translateY: interpolate(
          currentIndex.value,
          translateYInput,
          translateYOutput,
          Extrapolate.CLAMP,
        )
      },
      {
        scale: withScale ? interpolate(
          currentIndex.value,
          [0.9, 1],
          [1, 0.9],
          Extrapolate.CLAMP,
        ) : 1
      },
    ],
  }));

  const walletsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      currentIndex.value,
      [0, 0.2],
      [1, 0],
      Extrapolate.CLAMP,
    ),
  }));

  const onLayout = (event) => {
    const { width } = event.nativeEvent.layout;
    setWidthOfBalanceString(width);
  };

  const handleGoToReceiveScreen = () => {
    navigation.navigate(SCREEN_NAMES.RECEIVE_SCREEN);
  };

  const handleGoToSendScreen = () => {
    navigation.navigate(SCREEN_NAMES.SEND_SETUP_SCREEN);
  };

  const handleCopyAddress = () => {
    setString(address);
    Alert.alert("Address copied");
  };

  const currentBalanceLabelAnimatedStyle = animateTextOpacityAndTransform({ withOpacity: true });
  const balancePriceContainerAnimatedStyle = animateTextOpacityAndTransform({ withOpacity: false, withScale: true });
  const balancePriceEqualToAnimatedStyle = animateTextOpacityAndTransform({ withOpacity: true });
  const byLastPeriodContainerAnimatedStyle = animateTextOpacityAndTransform({ withOpacity: true });

  const currentBalanceLabelStyle = getStyle(styles.currentBalanceLabel, currentBalanceLabelAnimatedStyle, currentBalanceLabelAnimatedStyle);
  const balancePriceContainerStyle = getStyle(styles.balancePriceContainer, balancePriceContainerAnimatedStyle, balancePriceContainerAnimatedStyle);
  const balancePriceEqualToStyle = getStyle(styles.balancePriceEqualTo, balancePriceEqualToAnimatedStyle, balancePriceEqualToAnimatedStyle);
  const byLastPeriodContainerStyle = getStyle(styles.byLastPeriodContainer, byLastPeriodContainerAnimatedStyle, byLastPeriodContainerAnimatedStyle);
  const actionsContainerStyle = getStyle(styles.actionsContainer, actionsContainerAnimatedStyle, actionsContainerAnimatedStyle);
  const walletsStyle = getStyle(styles.walletsContainer, walletsAnimatedStyle, walletsAnimatedStyle);

  return (
    <View style={styles.container}>
      <Animated.View style={walletsStyle}>
        <CircleBtn
          label={null}
          Icon={WalletsIcon}
          size={40}
        />
        <ArrowDownIcon style={styles.walletsArray} />
      </Animated.View>
      <View style={styles.balanceContainer}>
        <View style={styles.currentBalanceContainer}>
          <Animated.View style={currentBalanceLabelStyle}>
            <CustomText
              size={12}
              color={"greyPrimary"}
            >
              Saldo
            </CustomText>
          </Animated.View>
          <Animated.View style={balancePriceContainerStyle} onLayout={onLayout}>
            <CustomText
              size={24}
              type={'bold'}
              style={[styles.balancePriceValue]}
            >
              {balance}
            </CustomText>
            <CustomText
              type={'bold'}
              style={[styles.balancePriceCurr]}
            >
              {putSymbol}
            </CustomText>
          </Animated.View>
          <Animated.View style={balancePriceEqualToStyle}>
            <CustomText
              size={12}
              color={"greyPrimary"}
            >
              {"33761.58"}
            </CustomText>
            <CustomText
              size={12}
              color={"greyPrimary"}
            >
              {` ${"USD"}`}
            </CustomText>
          </Animated.View>
        </View>
        <Animated.View style={byLastPeriodContainerStyle}>
          <CustomText
            size={12}
            color={"greyPrimary"}
            style={[styles.byLastPeriodLabel]}
          >
            Mes pasado
          </CustomText>
          <CustomText
            size={14}
            color={"success"}
            style={[styles.byLastPeriodValue]}
          >
            {"+36.12 USD (+5.2%)"}
          </CustomText>
        </Animated.View>
      </View>
      <Animated.View style={actionsContainerStyle}>
        <CircleBtn
          label={"Reponer\n Su billetera "}
          Icon={FillUpWalletIcon}
          onPress={handleGoToReceiveScreen}
        />
        <CircleBtn
          label={"Trasladar\n a una billetera "}
          Icon={SendToWalletIcon}
          onPress={handleGoToSendScreen}
        />
        <CircleBtn
          label={"Copiar\n la dirección "}
          Icon={CopyIcon}
          onPress={handleCopyAddress}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: HEIGHT_OF_BALANCE_CONTENT,
    paddingHorizontal: 21,
    position: "relative",
  },
  walletsContainer: {
    height: WALLETS_ICON_BOX_HEIGHT,
    marginTop: WALLETS_ICON_BOX_MARGIN_TOP,
    alignItems: "center",
  },
  walletsArray: {
    position: "absolute",
    top: 40 + WALLETS_ICON_BOX_HEIGHT / 6, // 44 - size of icon + 10 - marginTop
  },
  balanceContainer: {
    top: WALLETS_ICON_BOX_HEIGHT,
    left: HORIZONTAL_PADDING_BALANCE,
    position: "absolute",
    width: (width * 0.7) - HORIZONTAL_PADDING_BALANCE,
    height: HEIGHT_OF_BALANCE_CONTENT - ACTIONS_BOX_HEIGHT - WALLETS_ICON_BOX_HEIGHT,
  },
  currentBalanceContainer: {

  },
  currentBalanceLabel: {
    marginBottom: 6,
  },
  balancePriceContainer: {
    flexDirection: "row",
    marginBottom: 6,
  },
  balancePriceValue: {
    lineHeight: 24,
  },
  balancePriceCurr: {
    lineHeight: 24,
    marginLeft: 6,
  },
  balancePriceEqualTo: {
    flexDirection: "row",
    marginBottom: 42,
  },
  byLastPeriodContainer: {

  },
  byLastPeriodLabel: {
    marginBottom: 6,
  },
  byLastPeriodValue: {

  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    bottom: 0,
    position: "absolute",
    height: ACTIONS_BOX_HEIGHT,
    width: width,
    paddingHorizontal: HORIZONTAL_PADDING_BALANCE,
  },
});
