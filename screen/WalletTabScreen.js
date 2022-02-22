import React, { useState, useRef } from 'react';
import { ScrollView, View, StyleSheet, Platform } from 'react-native';
import {
  useSharedValue,
  useDerivedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { useSelector, useDispatch } from 'react-redux';

import { WalletBalanceScreen } from './WalletBalanceScreen';
import { WalletCardScreen } from './WalletCardScreen';
import { TabFullScreenBackgroundImage } from '../component/TabFullScreenBackgroundImage';
import { Pagination } from '../component/Pagination';
import { deviceSize } from '../sdk/helper';
import AppType from '../store/app/types';
import { GLOB_VAR } from '../styles/global';

const { width, height } = deviceSize;

const screens = [
  WalletBalanceScreen,
  WalletCardScreen,
];

export function WalletTabScreen({ navigation }) {
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const activeSlide = useSelector(state => state.app.activeSlide);
  const scrollRef = useRef(null);
  const bSheetBalanceRef = useRef(null);
  const bSheetCardRef = useRef(null);
  const dispatch = useDispatch();
  const scrollX = useSharedValue(0);
  const currentBalanceIndex = useSharedValue(0);
  const currentCardIndex = useSharedValue(0);

  const paginationIndex = useDerivedValue(() => {
    return activeSlide === 0 ? currentBalanceIndex.value : currentCardIndex.value;
  }, [activeSlide]);

  const paginationAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      paginationIndex.value,
      [0, 0.05],
      [1, 0],
      Extrapolate.CLAMP,
    ),
  }));
  const paginationStyle = [paginationAnimatedStyle, { top: GLOB_VAR.PAGINATION_TOP_POSITION }]

  const handleScroll = ({ nativeEvent }) => scrollX.value = nativeEvent.contentOffset.x;

  const goToSlide = (number) => {
    (number === 0)
      ? scrollRef.current.scrollTo({ x: 0, y: 0, animated: false })
      : scrollRef.current.scrollToEnd({ animated: true });

    dispatch({ type: AppType.CHANGE_ACTIVE_SLIDE, payload: number });
  };

  // onMomentumScrollEnd isn't fired if scrollTo was emitted (onAndroid).
  // It's prevent bug on goToSlide handler.
  const handleChangeSlideOnAndroid = ({ nativeEvent }) => {
    const slide = Math.ceil(nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width);
    if (slide !== activeSlide) dispatch({ type: AppType.CHANGE_ACTIVE_SLIDE, payload: slide });
  };

  // onScrollEndDrag has targetContentOffset property, that helps with calculating of next slide.
  // Isn't fired if scrollTo was emitted
  // It's prevent bug on goToSlide handler.
  const handleChangeSlideOnIOS = ({ nativeEvent }) => {
    const slide = Math.ceil(nativeEvent.targetContentOffset.x / nativeEvent.layoutMeasurement.width);
    if (slide !== activeSlide) dispatch({ type: AppType.CHANGE_ACTIVE_SLIDE, payload: slide });
  };

  return (
    <View style={styles.container}>
      <TabFullScreenBackgroundImage>
        <ScrollView
          ref={scrollRef}
          pagingEnabled={true}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          overScrollMode={"never"}
          bounces={false}
          scrollEnabled={scrollEnabled}
          style={styles.scrollContainer}
          scrollEventThrottle={16}
          onScroll={handleScroll}
          onMomentumScrollEnd={Platform.OS === "ios" ? null : handleChangeSlideOnAndroid}
          onScrollEndDrag={Platform.OS === "ios" ? handleChangeSlideOnIOS : null}
        >
          <WalletBalanceScreen
            navigation={navigation}
            currentIndex={currentBalanceIndex}
            setScrollEnabled={setScrollEnabled}
            bottomSheetRef={bSheetBalanceRef}
          />
          <WalletCardScreen
            navigation={navigation}
            currentIndex={currentCardIndex}
            paginationIndex={paginationIndex}
            setScrollEnabled={setScrollEnabled}
            scrollX={scrollX}
            goToSlide={goToSlide}
            bottomSheetRef={bSheetCardRef}
          />
        </ScrollView>
        <Pagination
          slides={screens}
          scrollX={scrollX}
          style={paginationStyle}
        />
      </TabFullScreenBackgroundImage>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    width,
    height,
  },
});
