import React, { useState, useEffect } from 'react';
import { Pressable, View, ImageBackground, StyleSheet, Image, Alert } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate, withTiming,
  Extrapolate,
} from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import { setString } from 'expo-clipboard';

import { CustomText } from './CustomText';
import { Circle } from './CircleBtn';
import CardBackground from '../assets/cardFrontBg.png';
import DemoBankCardLabel from '../assets/cardLabel.png';
import FrameForQR from '../assets/frameForQR.png';
import FrameForAddress from '../assets/frameForAddress.png';
import MockQR from '../assets/mockQR.png';
import { deviceSize, getStyle, StatusBarHeight } from '../sdk/helper';
import {
  CARD_HEIGHT,
  CARD_WIDTH,
  WIDTH_OF_QR_FRAME_WITH_SHADOW,
  HEIGHT_OF_QR_FRAME_WITH_SHADOW,
  WIDTH_OF_QR,
  HEIGHT_OF_QR,
  TOP_OFFSET_OF_QR,
  LEFT_OFFSET_OF_QR,
  WIDTH_OF_ADDRESS_FRAME,
  HEIGHT_OF_ADDRESS_FRAME,
  WALLETS_ICON_BOX_HEIGHT,
  HEIGHT_OF_CARD_CONTENT,
} from '../styles/global';
import { dark, greyPrimary, textWhite01, darkGrey } from '../styles/color.theme';
import { DEFAULT_RESOURCES } from '../styles/constants';

const { width } = deviceSize;
const CARD_FLIP_DURATION = 800;
const CARD_SHORT_FLIP_DURATION = 500;

export function Card({ scrollX, paginationIndex, goToSlide = () => {} }) {
  const progress = useSharedValue(0);
  const cardAnimatedValue = useSharedValue(0);
  const activeSlide = useSelector(state => state.app.activeSlide);
  const address = useSelector(state => state.wallet.address);
  const [isFront, setIsFront] = useState(true)

  const frontCardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotateY: `${cardAnimatedValue.value}deg`
      },
      { perspective: 1000 },
      {
        scale: interpolate(
          progress.value,
          [0, 0.5, 1],
          [1, 0.9, 1],
          Extrapolate.CLAMP,
        )
      }
    ],
  }));
  const backCardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotateY: `${cardAnimatedValue.value + 180}deg`,
      },
      { perspective: 1000 },
      {
        scale: interpolate(
          progress.value,
          [0, 0.5, 1],
          [1, 0.9, 1]
        )
      }
    ],
  }));

  useEffect(() => {
    if (activeSlide === 0 && !isFront) flipCard({ resetting: true });
  }, [activeSlide]);

  const flipCard = ({ nativeEvent, resetting = false }) => {
    if (resetting) {
      cardAnimatedValue.value = withTiming(cardAnimatedValue.value - 180, { duration: CARD_SHORT_FLIP_DURATION });
      progress.value = withTiming(1, { duration: CARD_SHORT_FLIP_DURATION }, () => progress.value = 0);

      setIsFront(true);
      return;
    }

    if (progress.value !== 0) return;

    if (activeSlide === 0) {
      goToSlide(1);
      return;
    }

    if (nativeEvent.pageX >= (width / 2)) {
      cardAnimatedValue.value = withTiming(cardAnimatedValue.value + 180, { duration: CARD_FLIP_DURATION });
    } else {
      cardAnimatedValue.value = withTiming(cardAnimatedValue.value - 180, { duration: CARD_FLIP_DURATION });
    }
    setIsFront(!isFront);
    progress.value = withTiming(1, { duration: CARD_FLIP_DURATION }, () => progress.value = 0);
  };

  const handleCopyAddress = () => {
    if (isFront) return;
    setString(address);
    Alert.alert("Dirección Copiada");
  };

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    top: interpolate(
      paginationIndex.value,
      [0, 1],
      [StatusBarHeight, -HEIGHT_OF_CARD_CONTENT],
      Extrapolate.CLAMP,
    ),
    transform: [
      {
        translateX: interpolate(
          scrollX.value,
          [0, width],
          [-(width * 0.3), 0],
          Extrapolate.CLAMP,
        ),
      },
    ],
  }));
  const containerStyle = getStyle(styles.container, containerAnimatedStyle, containerAnimatedStyle);

  return (
    <Animated.View style={containerStyle}>
        <Pressable
          onPress={flipCard}
          onLongPress={handleCopyAddress}
        >
          <Animated.View style={[styles.flipCard, styles.flipCardFront, frontCardAnimatedStyle]}>
            <ImageBackground source={CardBackground} style={styles.cardBg} resizeMode='contain' />

            <Image source={DemoBankCardLabel} style={styles.frontCardLabel}/>
            <View style={styles.frontCardNameWrapper}>
              <Circle
                style={{ marginRight: 12 }}
                size={45}
                contentSize={33}
                svgUri={DEFAULT_RESOURCES.graphCoinSvgUri}
              />
              <View style={styles.divider} />
              <CustomText
                style={{ marginLeft: 12, marginTop: 15 }}
                color={"white01"}
                size={16}
              >
                Bitcoin
              </CustomText>
            </View>
          </Animated.View>
          <Animated.View style={[styles.flipCard, styles.flipCardBack, backCardAnimatedStyle]}>
            <ImageBackground source={FrameForQR} style={styles.frameForQR}>
              <Image source={MockQR} style={styles.qr} />
            </ImageBackground>

            <ImageBackground source={FrameForAddress} style={styles.frameForAddress}>
              <CustomText
                size={12}
                style={styles.addressText}
              >
                {address}
              </CustomText>
            </ImageBackground>
          </Animated.View>
        </Pressable>
      </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    justifyContent: "center",
    position: "absolute",
    top: WALLETS_ICON_BOX_HEIGHT / 2,
  },
  flipCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backfaceVisibility: "hidden",
    backgroundColor: dark,
    borderRadius: 10,
    borderColor: darkGrey,
    borderWidth: 1,
  },
  cardBg: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    position: "absolute",
    backgroundColor: dark,
    borderRadius: 10,
  },
  flipCardFront: {
    padding: 24,
    justifyContent: "space-between",
  },
  frontCardLabel: {
    width: CARD_WIDTH * 0.3,
    resizeMode: "contain",
  },
  frontCardNameWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  divider: {
    width: 1,
    height: 19,
    backgroundColor: textWhite01,
    marginTop: 15
  },
  flipCardBack: {
    alignItems: "center",
    position: "absolute",
    top: 0,
    justifyContent: "space-around"
  },
  frameForQR: {
    width: WIDTH_OF_QR_FRAME_WITH_SHADOW,
    height: HEIGHT_OF_QR_FRAME_WITH_SHADOW,
    resizeMode: "contain",
  },
  qr: {
    width: WIDTH_OF_QR,
    height: HEIGHT_OF_QR,
    top: TOP_OFFSET_OF_QR,
    left: LEFT_OFFSET_OF_QR,
  },
  frameForAddress: {
    width: WIDTH_OF_ADDRESS_FRAME,
    height: HEIGHT_OF_ADDRESS_FRAME,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: (HEIGHT_OF_ADDRESS_FRAME * 0.356) / 2,
    paddingHorizontal: (WIDTH_OF_ADDRESS_FRAME * 0.09) / 2,
  },
  addressText: {
    color: greyPrimary,
    lineHeight: (HEIGHT_OF_ADDRESS_FRAME - (HEIGHT_OF_ADDRESS_FRAME * 0.356)) / 2,
  },
});
