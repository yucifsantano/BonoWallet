import React from 'react';
import { useSelector } from 'react-redux';
import { View, StyleSheet } from 'react-native';
import { MaterialIcons, FontAwesome, Ionicons } from '@expo/vector-icons';

import { GoToButton } from '../component/GoToButton';
import { FingerPrintIcon } from '../component/Icons';
import { dark, textWhite } from '../styles/color.theme';
import { SCREEN_NAMES, LOCAL_AUTH_SCREEN_MODE } from '../styles/constants';

export function GlobalSettingsScreen({ navigation }) {
  const isPasscodeExist = useSelector(state => state.app.isPasscodeExist);

  const handleGoToSecurity = () => {
    if (isPasscodeExist) {
      navigation.navigate(
        SCREEN_NAMES.LOCK_APP_NAVIGATOR,
        {
          toPath: SCREEN_NAMES.SECURITY_SETTINGS_SCREEN,
          fromPath: SCREEN_NAMES.GLOBAL_SETTINGS_SCREEN,
          mode: LOCAL_AUTH_SCREEN_MODE.CONFIRM_PASSCODE,
        }
      );
    } else {
      navigation.navigate(SCREEN_NAMES.SECURITY_SETTINGS_SCREEN);
    }
  };

  return (
    <View style={styles.container}>
      <GoToButton
        to={SCREEN_NAMES.SERVER_SETTINGS_SCREEN}
        Icon={(
          <Ionicons
            name="git-network-outline"
            size={24}
            color={textWhite}
          />
        )}
      >
        Servidor
      </GoToButton>

      <GoToButton
        onPress={handleGoToSecurity}
        Icon={(
          <FingerPrintIcon
            color={textWhite}
          />
        )}
      >
        Seguridad
      </GoToButton>

      <GoToButton
        disabled={true}
        Icon={(
          <Ionicons
            name="language"
            size={24}
            color={textWhite}
          />
        )}
      >
        Idioma de interfaz
      </GoToButton>

      <GoToButton
        disabled={true}
        Icon={(
          <FontAwesome
            name="dollar"
            size={24}
            color={textWhite}
          />
        )}
      >
        Moneda
      </GoToButton>

      <GoToButton
        disabled={true}
        Icon={(
          <Ionicons
            name="sunny-outline"
            size={24}
            color={textWhite}
          />
          // Icon={<Ionicons name="moon-outline" size={24} color={textWhite} />}
        )}
      >
        Tema
      </GoToButton>

      <GoToButton
        disabled={true}
        Icon={(
          <MaterialIcons
            name="privacy-tip"
            size={24}
            color={textWhite}
          />
        )}
      >
        Condiciones y posiciones
      </GoToButton>
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
});
