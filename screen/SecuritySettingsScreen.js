import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, Switch, StyleSheet, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { CustomText } from '../component/CustomText';
import { InfoRow } from '../component/InfoRow';
import { GoToButton } from '../component/GoToButton';
import { dark, textWhite, green, darkGrey, greySecondary } from '../styles/color.theme';
import { SCREEN_NAMES, LOCAL_AUTH_SCREEN_MODE, BIOMETRIC_METHOD, SECURE_STORE_NAMES, AUTO_LOCK_VALUE_TRANSL } from '../styles/constants';
import Types from '../store/app/types';

const biometricMethodTransl = {
  [BIOMETRIC_METHOD.FINGERPRINT]: "Desbloquear con huella digital",
  [BIOMETRIC_METHOD.FACE_ID]: "Desbloqueo por cara",
};

export function SecuritySettingsScreen({ navigation }) {
  const isPasscodeExist = useSelector(state => state.app.isPasscodeExist);
  const biometricIsOn = useSelector(state => state.app.biometricIsOn);
  const biometricMethod = useSelector(state => state.app.biometricMethod);
  const autoLockValue = useSelector(state => state.app.autoLockValue);
  const dispatch = useDispatch();

  const handleChangeIsSetPasscode = ({ nativeEvent }) => {
    const isTurnOn = nativeEvent.value;
    navigation.replace(
      SCREEN_NAMES.LOCK_APP_NAVIGATOR,
      {
        toPath: SCREEN_NAMES.SECURITY_SETTINGS_SCREEN,
        fromPath: SCREEN_NAMES.SECURITY_SETTINGS_SCREEN,
        mode: isTurnOn ? LOCAL_AUTH_SCREEN_MODE.CREATE_PASSCODE : LOCAL_AUTH_SCREEN_MODE.DELETE_PASSCODE
      },
    );
  };

  const handleChangeBiometricIsOn = async ({ nativeEvent }) => {
    const isTurnOn = nativeEvent.value;
    dispatch({ type: Types.CHANGE_BIOMETRIC_IS_ON, payload: isTurnOn });
    await AsyncStorage.setItem(SECURE_STORE_NAMES.BIOMETRIC_IS_ON, isTurnOn.toString());
  };

  return (
    <View style={styles.container}>
      <InfoRow
        containerStyle={[styles.blockContainer, styles.infoRowContainer]}
        label={"Aplicaciones de bloqueo"}
        labelStyle={{ color: textWhite }}
        valueComponent={(
          <Switch
            value={isPasscodeExist}
            style={styles.switch}
            thumbColor={textWhite}
            trackColor={{ true: green, false: darkGrey }}
            ios_backgroundColor={darkGrey}
            onChange={handleChangeIsSetPasscode}
          />
        )}
        widthBorder={false}
        blockWidthRatio={[70, 30]}
      />
      <View style={[{ marginBottom: 24, paddingHorizontal: 12 }]}>
        <CustomText color={'greySecondary'}>
        IMPORTANTE: Si olvida la contraseña de acceso, deberá reinstalar las aplicaciones e importar billeteras
        </CustomText>
      </View>
      {
        isPasscodeExist && (
          <>
            <View style={styles.blockContainer}>
              <GoToButton
                to={SCREEN_NAMES.LOCK_APP_NAVIGATOR}
                navigationParams={{
                  toPath: SCREEN_NAMES.SECURITY_SETTINGS_SCREEN,
                  fromPath: SCREEN_NAMES.SECURITY_SETTINGS_SCREEN,
                  mode: LOCAL_AUTH_SCREEN_MODE.CREATE_PASSCODE,
                }}
                style={{ marginBottom: 0 }}
              >
                Cambia la contraseña
              </GoToButton>
            </View>

            {
              biometricMethod !== BIOMETRIC_METHOD.NONE && (
                <InfoRow
                  containerStyle={[styles.blockContainer, styles.infoRowContainer]}
                  label={biometricMethodTransl[biometricMethod]}
                  labelStyle={{ color: textWhite }}
                  valueComponent={(
                    <Switch
                      value={biometricIsOn}
                      style={styles.switch}
                      thumbColor={textWhite}
                      trackColor={{ true: green, false: darkGrey }}
                      ios_backgroundColor={darkGrey}
                      onChange={handleChangeBiometricIsOn}
                    />
                  )}
                  widthBorder={false}
                  blockWidthRatio={[70, 30]}
                />
              )
            }

            <View style={styles.blockContainer}>
              <GoToButton
                to={SCREEN_NAMES.AUTO_LOCK_LIST_SCREEN}
                style={{ marginBottom: 0 }}
              >
                Automático
              </GoToButton>
              <CustomText
                color={'greySecondary'}
                style={{ paddingHorizontal: 12 }}
              >
                {AUTO_LOCK_VALUE_TRANSL[autoLockValue]}
              </CustomText>
            </View>
          </>
        )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: dark,
    paddingHorizontal: 18,
    paddingVertical: 24,
  },
  blockContainer: {
    marginBottom: 12,
  },
  infoRowContainer: {
    paddingVertical: Platform.OS === "android" ? 0 : 12,
  },
  switch: {},
});
