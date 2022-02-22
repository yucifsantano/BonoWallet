import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { AntDesign } from '@expo/vector-icons';

import { CustomText } from '../component/CustomText';
import { CustomButton } from '../component/CustomButton';
import { CustomInput } from '../component/CustomInput';
import { PADDING_TOP_FROM_NAVIGATION_HEADER } from '../styles/global';
import { importWalletAction } from '../store/wallet/actions';
import { textWhite, dark, lightDark, greyPrimary } from '../styles/color.theme';

export function ImportWalletScreen({}) {
  const [privateKey, setPrivateKey] = useState("");
  const loading = useSelector(state => state.wallet.loading);
  const dispatch = useDispatch();

  const handleChangeInput = (value) => {
    setPrivateKey(value);
  };

  const handleContinue = () => {
    if (!privateKey) return;
    dispatch(importWalletAction({ privateKey }));
  };

  return (
    <ScrollView
      style={[styles.container]}
      contentContainerStyle={[styles.contentContainer]}
      overScrollMode={"never"}
      bounces={false}
      keyboardShouldPersistTap={"always"}
    >
      <View style={styles.headerText}>
        <CustomText
          size={12}
          align={"center"}
          style={{ marginBottom: 12 }}
        >
          Verificar la clave privada
        </CustomText>
        <CustomText
          size={12}
          color={"greySecondary"}
          align={"center"}
        >
          Ingrese o pegue la llave privada de la billetera importada.
        </CustomText>
      </View>
      <View style={styles.inputBox}>
        <CustomInput
          value={privateKey}
          label={"Llave privada"}
          multiline={true}
          blurOnSubmit={true}
          onChangeText={handleChangeInput}
          onSubmitEditing={handleContinue}
        />
      </View>
      <View style={styles.infoWrapper}>
        <AntDesign name="exclamationcircle" size={24} color={textWhite} />
        <CustomText
          size={12}
          align={"center"}
          style={{ marginTop: 18 }}
        >
          ¡Nunca transmita la clave privada a alguien, manténgala segura!
        </CustomText>
      </View>
      <View style={styles.footerWrapper}>
        <CustomButton
          loading={loading}
          isLarge={true}
          disabled={!privateKey}
          onPress={handleContinue}
        >
          Continuar
        </CustomButton>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: dark,
  },
  contentContainer: {
    paddingTop: PADDING_TOP_FROM_NAVIGATION_HEADER,
    paddingHorizontal: 18,
    alignItems: "center",
    flex: 1,
  },
  headerText: {
    paddingHorizontal: 36,
    marginBottom: 18,
  },
  inputBox: {
    width: "100%",
    borderWidth: 1,
    borderColor: greyPrimary,
    backgroundColor: lightDark,
    borderRadius: 15,
    padding: 18,
    marginBottom: 18,
  },
  infoWrapper: {
    padding: 24,
    backgroundColor: lightDark,
    borderRadius: 15,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },
  footerWrapper: {
    marginBottom: 60,
  },
});
