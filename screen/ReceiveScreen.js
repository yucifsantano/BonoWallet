import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { ScrollView, View, Image, StyleSheet, Alert, Share } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Ionicons } from '@expo/vector-icons';
import Dialog from 'react-native-dialog';
import { setString } from 'expo-clipboard';

import { CustomText } from '../component/CustomText';
import { CircleBtn } from '../component/CircleBtn';
import { CopyIcon } from '../component/Icons';
import DemoLogo from '../assets/demoLogo.png';
import DemoBankLabel from '../assets/demoLabelDark.png';
import { dark, lightDark, greyPrimary, active, textWhite } from '../styles/color.theme';
import { DEFAULT_RESOURCES } from '../styles/constants';
import { deviceSize } from '../sdk/helper';

const { width } = deviceSize;

export function ReceiveScreen({ navigation }) {
  const inputRef = useRef(null);
  const qrRef = useRef(null);
  const address = useSelector(state => state.wallet.address);
  const putSymbol = useSelector(state => state.wallet.putSymbol);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [amountValue, setAmountValue] = useState({ confirmed: "", temp: "" });
  const [qrValue, setQrValue] = useState(address);

  const handleToggleAmountInput = () => {
    setDialogVisible(!dialogVisible);
  };

  const handleCopyAddress = () => {
    setString(`Clave pública para recibir ${putSymbol}: ${address}`);
    Alert.alert("Dirección copiada");
  };

  const handleShare = async () => {
    try {
      await qrRef.current.toDataURL(async (data) => {
        await Share.share({
          message: `Clave pública para recibir ${putSymbol}: ${address}\n BonoWallet`,
          title: "Dirección pública",
        });
      });
    } catch (e) {
      console.error(e);
    }
  };

  const onDialogLayout = () => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleInputChange = (value) => {
    setAmountValue({ ...amountValue, temp: value });
  };

  const handleDialogCancel = () => {
    setDialogVisible(false);
    setAmountValue({ ...amountValue, temp: amountValue.confirmed });
  };

  const handleDialogConfirm = () => {
    setDialogVisible(false);
    const value = (!amountValue.temp || amountValue.temp === "0") ? "" : amountValue.temp;
    setAmountValue({ temp: value, confirmed: value })
    setQrValue(!!value ? `${address}?balance=${value}` : address);
  };

  return (
    <ScrollView
      overScrollMode={"never"}
      bounces={false}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps={"always"}
    >
      <View style={styles.qrContainer}>
        <View style={styles.logoContainer}>
          <Image source={DemoLogo} style={styles.logoStyle} resizeMode='contain' />
          <Image source={DemoBankLabel} style={styles.logoLabel} resizeMode='contain' />
        </View>
        <QRCode
          value={qrValue}
          size={width * 0.6}
          backgroundColor={dark}
          logo={{ uri: DEFAULT_RESOURCES.graphCoinPngUri }}
          logoSize={42}
          logoBackgroundColor={dark}
          quietZone={6}
          enableLinearGradient={true}
          linearGradient={[active, textWhite]}
          getRef={qrRef}
          onError={(error) => console.log(error)}
        />
        <CustomText color={'greyPrimary'} style={{ marginTop: 18 }}>
          {address}
        </CustomText>
      </View>

      <CustomText
        size={12}
        align={'center'}
        style={{ marginVertical: 6 }}
      >
        {`Solamente enviar ${putSymbol} a este destinatario.`}
      </CustomText>

      <View style={styles.actionsContainer}>
        <CircleBtn
          label={"Copiar"}
          Icon={CopyIcon}
          onPress={handleCopyAddress}
        />
        <CircleBtn
          label={"Cantidad"}
          Icon={() => <Ionicons name="pricetags-outline" size={24} color={textWhite} />}
          onPress={handleToggleAmountInput}
        />
        <CircleBtn
          label={"Compartir"}
          Icon={() => <Ionicons name="share-outline" size={24} color={textWhite} />}
          onPress={handleShare}
        />
      </View>

      <Dialog.Container
        contentStyle={styles.dialogContainer}
        visible={dialogVisible}
        onBackdropPress={handleToggleAmountInput}
      >
        <Dialog.Title>
          <CustomText>Introduce la cantidad</CustomText>
        </Dialog.Title>
        <Dialog.Input
          value={amountValue.temp}
          textInputRef={inputRef}
          keyboardType={"numeric"}
          onLayout={onDialogLayout}
          onChangeText={handleInputChange}
          style={{ color: textWhite, textAlign: "center" }}
        />
        <Dialog.Button color={greyPrimary} label={"Cancel"} onPress={handleDialogCancel} />
        <Dialog.Button color={active} label={"Okay"} onPress={handleDialogConfirm} />
      </Dialog.Container>
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
    alignItems: "center",
    flex: 1,
    justifyContent: "space-between",
  },
  qrContainer: {
    flex: 0,
    backgroundColor: lightDark,
    borderRadius: 15,
    borderColor: greyPrimary,
    borderWidth: 1,
    paddingVertical: 24,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  logoContainer: {
    padding: 6,
    marginBottom: 12,
    alignItems: "center",
    backgroundColor: lightDark,
    borderRadius: 15,
  },
  logoStyle: {
    width: 36,
    height: 36,
    marginBottom: 6,
  },
  logoLabel: {
    height: 21,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
    paddingHorizontal: width * 0.05,
    width: width - (width * 0.05 * 2),
  },
  dialogContainer: {
    backgroundColor: lightDark,
    width: width * 0.8,
  },
});
