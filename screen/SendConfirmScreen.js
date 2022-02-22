import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ScrollView, View, StyleSheet, Alert } from 'react-native';
import { setString } from 'expo-clipboard';

import { InfoRow } from '../component/InfoRow';
import { CustomButton } from '../component/CustomButton';
import { sendToWallet } from '../store/wallet/actions';
import { dark, greyPrimary, lightDark } from '../styles/color.theme';

export function SendConfirmScreen({ navigation }) {
  const address = useSelector(state => state.wallet.address);
  const amountValue = useSelector(state => state.wallet.amountValue);
  const receiverAddress = useSelector(state => state.wallet.receiverAddress);
  const putSymbol = useSelector(state => state.wallet.putSymbol);
  const dispatch = useDispatch();

  const handleCopyAddress = (value, label) => {
    setString(value);
    Alert.alert(`"${label}" El valor se copió`);
  };

  const handleConfirm = async () => {
    await dispatch(sendToWallet({
      from: address,
      to: receiverAddress,
      amount: amountValue,
      putSymbol: putSymbol,
    }));
  };

  return (
    <ScrollView
      overScrollMode={"never"}
      bounces={false}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.infoWrapper}>
        <InfoRow
          label={"From"}
          value={address}
          direction={"column"}
          widthBorder={false}
          onCopy={handleCopyAddress}
        />
        <InfoRow
          label={"To"}
          value={receiverAddress}
          direction={"column"}
          widthBorder={false}
          onCopy={handleCopyAddress}
        />
      </View>
      <View style={styles.infoWrapper}>
        <InfoRow
          label={"Amount"}
          value={amountValue}
          widthBorder={false}
        />
        <InfoRow
          label={"Put"}
          value={putSymbol}
          widthBorder={false}
        />
      </View>
      <CustomButton onPress={handleConfirm}>
        Подтвердить
      </CustomButton>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: dark,
  },
  contentContainer: {
    paddingVertical: 24,
    paddingHorizontal: 18,
  },
  infoWrapper: {
    backgroundColor: lightDark,
    marginVertical: 12,
    borderRadius: 15,
    borderColor: greyPrimary,
    borderWidth: 1,
  },
});
