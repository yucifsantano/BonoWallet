import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { View, StyleSheet } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Camera } from 'expo-camera';

import { CustomText } from '../component/CustomText';
import { dark } from '../styles/color.theme';
import { SCREEN_NAMES } from '../styles/constants';
import WalletTypes from '../store/wallet/types';

export function QrScannerScreen({ navigation }) {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status !== "granted") {
        navigation.goBack();
        return;
      }
      setHasCameraPermission(status === "granted");
    })();
  }, []);

  const handleOnScanned = (data) => {
    const result = data.data;

    if (!!result) {
      const strArray = result.split("?");
      const address = strArray[0];

      if (strArray[1]) {
        const amount = strArray[1].split("=")[1];
        dispatch({ type: WalletTypes.CHANGE_AMOUNT_VALUE, payload: amount });
      }

      setScanned(true);
      dispatch({ type: WalletTypes.CHANGE_RECEIVE_ADDRESS, payload: address });
      navigation.navigate(SCREEN_NAMES.SEND_SETUP_SCREEN);
    }
  };

  if (hasCameraPermission === null) {
    return (
      <View style={styles.container}>
        <CustomText>
        Solicitud para el uso de la cámara
        </CustomText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ratio={"16:9"}
        type={"back"}
        barCodeScannerSettings={[BarCodeScanner.Constants.BarCodeType.qr]}
        style={[StyleSheet.absoluteFillObject]}
        onBarCodeScanned={scanned ? null : handleOnScanned}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: dark,
  },
});
