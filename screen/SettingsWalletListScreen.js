import React, { useRef, useMemo, useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useSharedValue } from "react-native-reanimated";
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { FontAwesome } from '@expo/vector-icons';

import { Profile } from '../component/Profile';
import { GoToButton } from '../component/GoToButton';
import { CustomText } from '../component/CustomText';
import { WalletItem } from '../component/WalletItem';
import { CustomBottomSheetBackground } from '../component/CustomBottomSheetBackground';
import { CustomHandleBS } from '../component/CustomHandleBS';
import { TabFullScreenBackgroundImage } from '../component/TabFullScreenBackgroundImage';
import { SettingsIcon, AddIcon } from '../component/Icons';
import { getWalletDataAction } from '../store/wallet/actions';
import { getProfileAction } from '../store/app/actions';
import AppTypes from '../store/app/types';
import { deviceSize, onIOSBottomSheetIndexChange, onIOSBottomSheetListScroll } from '../sdk/helper';
import { textWhite, greyPrimary, active07 } from '../styles/color.theme';
import { SCREEN_NAMES } from '../styles/constants';
import { GLOB_VAR } from '../styles/global';

const { height, width } = deviceSize;

export function SettingsWalletListScreen({ navigation }) {
  const currentIndex = useSharedValue(0);
  const bottomSheetRef = useRef(null);
  const listRef = useRef(null);
  const snapPoints = useMemo(() => [GLOB_VAR.INITIAL_SETTINGS_SNAP_POINT, GLOB_VAR.SECOND_SNAP_POINT_SETTINGS], []);
  const [listScrollEnabled, setListScrollEnabled] = useState(false);
  const wallets = useSelector(state => state.wallet.wallets);
  const address = useSelector(state => state.wallet.address);
  const loading = useSelector(state => state.wallet.loading);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProfileAction());
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('state', (e) => {
      bottomSheetRef.current.snapToIndex(0);
    });

    return unsubscribe;
  }, [navigation]);

  const changeWallet = (wallet) => {
    dispatch(getWalletDataAction({ address: wallet.address }));
    dispatch({ type: AppTypes.CHANGE_ACTIVE_SLIDE, payload: 0 });
    navigation.navigate(SCREEN_NAMES.WALLET_SCREEN);
  };

  const goToWalletSettings = (wallet) => {
    navigation.navigate(SCREEN_NAMES.SETTINGS_WALLET_ITEM, { walletAddress: wallet.address });
  };

  const handleBottomSheetIndexChange = (index) => {
    if (Platform.OS === "ios") {
      onIOSBottomSheetIndexChange({
        index: index,
        scrollingSetter: setListScrollEnabled,
        listRef: listRef,
      });
    }
  };

  const handleOnScroll = ({ nativeEvent }) => {
    onIOSBottomSheetListScroll({
      y: nativeEvent.contentOffset.y,
      scrollingSetter: setListScrollEnabled,
      bsRef: bottomSheetRef,
    });
  };

  let BottomSheetChildComponent = Platform.OS === "ios" ? FlatList : BottomSheetFlatList;

  return (
    <View style={styles.container}>
      <TabFullScreenBackgroundImage>
        <Profile currentIndex={currentIndex} />
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          backgroundComponent={CustomBottomSheetBackground}
          handleComponent={() => !!wallets && wallets.length > 0 ? (
            <CustomHandleBS Icon={<FontAwesome name="arrows-v" size={18} color={active07} />} />
          ) : null}
          enableHandlePanningGesture={true}
          animatedIndex={currentIndex}
          enableOverDrag={false}
          onChange={handleBottomSheetIndexChange}
          keyboardBehavior={"extend"}
        >
          <BottomSheetChildComponent
            ref={listRef}
            alwaysBounceHorizontal={false}
            alwaysBounceVertical={false}
            bounces={false}
            ListHeaderComponent={
              <View>
                <GoToButton
                  to={SCREEN_NAMES.GLOBAL_SETTINGS_SCREEN}
                  style={styles.settingsButton}
                  Icon={<SettingsIcon color={textWhite} />}
                >
                  Configuración de la aplicación
                </GoToButton>

                <View style={styles.multiWalletListHeader}>
                  <CustomText
                    color={"greyPrimary"}
                    size={12}
                  >
                    Carteras de múltiples monedas
                  </CustomText>
                </View>

                <GoToButton
                  to={SCREEN_NAMES.ADD_WALLET_SCREEN}
                  style={styles.settingsButton}
                  Icon={<AddIcon />}
                >
                  Nueva billetera
                </GoToButton>
              </View>
            }
            data={wallets}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            renderItem={({ item, index }) => (
              <WalletItem
                index={index}
                loading={loading}
                item={item}
                chosenItem={address === item.address}
                onItemPress={changeWallet}
                onActionPress={goToWalletSettings}
              />
            )}
            keyExtractor={(item) => item.address}
            extraData={address}
            contentContainerStyle={styles.bottomSheetContainer}
            scrollEnabled={Platform.OS === "ios" ? listScrollEnabled : true}
            onScroll={Platform.OS === "ios" ? handleOnScroll : () => {}}
          />
        </BottomSheet>
      </TabFullScreenBackgroundImage>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width,
    height,
  },
  bottomSheetContainer: {
    marginTop: Platform.OS === "ios" ? 38 : 18,
    paddingBottom: height * 0.2 + 75, // gradient in bottom navigator
    paddingHorizontal: 18,
  },
  settingsButton: {
    marginBottom: 18,
  },
  multiWalletListHeader: {
    paddingBottom: 12,
    justifyContent: "center",
    alignItems: "center",
  }
});
