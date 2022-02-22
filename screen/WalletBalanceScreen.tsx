import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { View, StyleSheet, SectionList, Platform } from 'react-native';
import BottomSheet, { BottomSheetSectionList } from '@gorhom/bottom-sheet';
import {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { FontAwesome } from '@expo/vector-icons';

import { BalanceSheet } from '../component/BalanceSheet';
import { TransactionHeader } from '../component/Transaction/TransactionHeader';
import { TransactionItem } from '../component/Transaction/TransactionItem';
import { EmptyList } from '../component/EmptyList';
import { CustomBottomSheetBackground } from '../component/CustomBottomSheetBackground';
import { CustomHandleBS } from '../component/CustomHandleBS';
import { GLOB_VAR } from '../styles/global';
import {
  deviceSize,
  onIOSBottomSheetIndexChange,
  onIOSBottomSheetListScroll,
  groupingTransactionsList,
} from '../sdk/helper';
import { SCREEN_NAMES } from '../styles/constants';
import { active07 } from '../styles/color.theme';

const { width, height } = deviceSize;

export const WalletBalanceScreen = React.memo(({
  navigation,
  currentIndex,
  setScrollEnabled,
  bottomSheetRef,
}) => {
  const listRef = useRef(null);
  const address = useSelector(state => state.wallet.address);
  const balance = useSelector(state => state.wallet.balance);
  // TODO: change it when wallet has puts
  const putSymbol = useSelector(state => state.wallet.putSymbol);
  const transactions = useSelector(state => state.wallet.transactions);
  const [formattedTransactions, setFormattedTransactions] = useState([]);
  const [listScrollEnabled, setListScrollEnabled] = useState(false);
  const snapPoints = useMemo(() => [GLOB_VAR.INITIAL_SNAP_POINT, GLOB_VAR.SECOND_SNAP_POINT_BALANCE], []);

  useEffect(() => {
    const formattedList = groupingTransactionsList(transactions);
    setFormattedTransactions(formattedList);
  }, [transactions]);

  const animationOfEmptyImage = useAnimatedStyle(() => ({
    height: interpolate(
      currentIndex.value,
      [0, 1],
      [GLOB_VAR.INITIAL_SNAP_POINT * 0.4, GLOB_VAR.SECOND_SNAP_POINT_BALANCE * 0.5],
      Extrapolate.CLAMP,
    ),
    transform: [
      {
        rotateY: `${interpolate(
          currentIndex.value,
          [0.3, 0.7],
          [0, 180],
          Extrapolate.CLAMP
        )}deg`
      }
    ]
  }));

  const handleGetDetails = (transaction) => {
    navigation.navigate(SCREEN_NAMES.DETAILS_SCREEN, { transaction: transaction });
  };

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

  let BottomSheetChildComponent = Platform.OS === "ios" ? SectionList : BottomSheetSectionList;

  return (
    <View style={styles.container}>
      <BalanceSheet
        address={address}
        balance={balance}
        putSymbol={putSymbol}
        currentIndex={currentIndex}
        navigation={navigation}
      />
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        backgroundComponent={CustomBottomSheetBackground}
        handleComponent={() => formattedTransactions.length > 0 ? (
          <CustomHandleBS Icon={<FontAwesome name="arrows-v" size={18} color={active07} />} />
        ) : null}
        enableHandlePanningGesture={true}
        animatedIndex={currentIndex}
        enableOverDrag={true}
        onChange={handleBottomSheetIndexChange}
        keyboardBehavior={"extend"}
      >
        <BottomSheetChildComponent
          ref={listRef}
          stickySectionHeadersEnabled={true}
          bounces={false}
          alwaysBounceVertical={false}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          sections={formattedTransactions}
          keyExtractor={(item) => item.block}
          renderSectionHeader={({ section: { title } }) => <TransactionHeader title={title} />}
          renderItem={({ item }) => <TransactionItem item={item} address={address} onPress={handleGetDetails} />}
          ListEmptyComponent={(
            <EmptyList
              text={"Las transacciones en esta billetera aún no se han realizado."}
              imageStyle={animationOfEmptyImage}
            />
          )}
          contentContainerStyle={styles.bottomSheetContainer}
          scrollEnabled={Platform.OS === "ios" ? listScrollEnabled : true}
          onScroll={Platform.OS === "ios" ? handleOnScroll : () => {}}
        />
      </BottomSheet>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width,
    height,
  },
  bottomSheetContainer: {
    marginTop: Platform.OS === "ios" ? 38 : 18,
    paddingBottom: height * 0.2 + 75, // gradient in bottom navigator
  },
});
