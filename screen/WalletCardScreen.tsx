import React, { useState, useRef, useMemo } from 'react';
import { View, StyleSheet, Platform, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { FontAwesome } from '@expo/vector-icons';

import { CardSheet } from '../component/CardSheet';
import { CustomBottomSheetBackground } from '../component/CustomBottomSheetBackground';
import { CustomHandleBS } from '../component/CustomHandleBS';
import { SettingsWalletItem } from './SettingsWalletItemScreen';
import { GLOB_VAR } from '../styles/global';
import {
  deviceSize,
  StatusBarHeight,
  onIOSBottomSheetIndexChange,
  onIOSBottomSheetListScroll,
} from '../sdk/helper';
import { active07 } from '../styles/color.theme';

const { width, height } = deviceSize;

export const WalletCardScreen = React.memo(({
  navigation,
  currentIndex,
  paginationIndex,
  setScrollEnabled,
  scrollX,
  goToSlide,
  bottomSheetRef,
}) => {
  const listRef = useRef(null);
  const [listScrollEnabled, setListScrollEnabled] = useState(false);
  const address = useSelector(state => state.wallet.address);
  const snapPoints = useMemo(() => [GLOB_VAR.INITIAL_SNAP_POINT, GLOB_VAR.SECOND_SNAP_POINT_CARD], []);

  const handleBottomSheetIndexChange = (index) => {
    if (Platform.OS === "ios") {
      onIOSBottomSheetIndexChange({
        index: index,
        scrollingSetter: setListScrollEnabled,
        listRef: listRef,
      });
    }

    setScrollEnabled(index !== 1)
  };

  const handleOnScroll = ({ nativeEvent }) => {

    onIOSBottomSheetListScroll({
      y: nativeEvent.contentOffset.y,
      scrollingSetter: setListScrollEnabled,
      bsRef: bottomSheetRef,
    });
  };

  let BottomSheetChildComponent = Platform.OS === "ios" ? ScrollView : BottomSheetScrollView;

  return (
    <View style={styles.container}>
      <CardSheet
        currentIndex={currentIndex}
        scrollX={scrollX}
        paginationIndex={paginationIndex}
        goToSlide={goToSlide}
      />
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        backgroundComponent={CustomBottomSheetBackground}
        handleComponent={() => (
          <CustomHandleBS Icon={<FontAwesome name="arrows-v" size={18} color={active07} />} />
        )}
        enableHandlePanningGesture={true}
        animatedIndex={currentIndex}
        enableOverDrag={true}
        onChange={handleBottomSheetIndexChange}
        keyboardBehavior={"extend"}
      >
        <BottomSheetChildComponent
          ref={listRef}
          bounces={false}
          alwaysBounceVertical={false}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          contentContainerStyle={styles.bottomSheetContainer}
          scrollEnabled={Platform.OS === "ios" ? listScrollEnabled : true}
          onScroll={Platform.OS === "ios" ? handleOnScroll : () => {}}
        >
          <SettingsWalletItem navigation={navigation} walletAddress={address} insideBottomSheet={true} />
        </BottomSheetChildComponent>
      </BottomSheet>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width,
    height,
    paddingTop: StatusBarHeight,
  },
  bottomSheetContainer: {
    marginTop: 20,
    paddingBottom: height * 0.2 + 75, // gradient in bottom navigator
  },
});
