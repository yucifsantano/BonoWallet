import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { TabNavigator } from './TabNavigator';
import { LocalAuthorizationNavigator } from './LocalAuthorizationNavigator';
import { DetailsTransactionScreen } from '../screen/DetailsTransactionScreen';
import { SendSetupScreen } from '../screen/SendSetupScreen';
import { SendConfirmScreen } from '../screen/SendConfirmScreen';
import { ReceiveScreen } from '../screen/ReceiveScreen';
import { GlobalSettingsScreen } from '../screen/GlobalSettingsScreen';
import { SettingsWalletItemScreen } from '../screen/SettingsWalletItemScreen';
import { ServerSettingsScreen } from '../screen/ServerSettingsScreen';
import { SecuritySettingsScreen } from '../screen/SecuritySettingsScreen';
import { AutoLockListScreen } from '../screen/AutoLockListScreen';
import { QrScannerScreen } from '../screen/QrScannerScreen';
import { AddWalletScreen } from '../screen/AddWalletScreen';
import { GenerateWalletScreen } from '../screen/GenerateWalletScreen';
import { ImportWalletScreen } from '../screen/ImportWalletScreen';
import { WalletPublicKeyScreen } from '../screen/WalletPublicKeyScreen';
import { WalletPrivateKeyScreen } from '../screen/WalletPrivateKeyScreen';
import { BackNavigation } from '../component/BackNavigation';
import { lightDark, active } from '../styles/color.theme';
import { SCREEN_NAMES } from '../styles/constants';

const AppStack = createNativeStackNavigator();
export function AppNavigator() {
  return (
    <AppStack.Navigator screenOptions={{ headerShown: false }}>
      <AppStack.Screen
        name={SCREEN_NAMES.TABS_NAVIGATOR}
        component={TabNavigator}
      />

      <AppStack.Group screenOptions={{
        headerShown: true,
        headerShadowVisible: false,
        headerStyle: { backgroundColor: lightDark },
        headerTintColor: active,
      }}>
        <AppStack.Group screenOptions={({ navigation }) => ({
          animation: Platform.OS === "ios" ? "default" : "slide_from_right",
          headerLeft: (props) => (
            <BackNavigation
              title={"Volver"}
              navigation={navigation}
              {...props}
            />
          ),
        })}>
          <AppStack.Screen
            options={{
              title: null,
              animation: Platform.OS === "ios" ? "slide_from_left" : "fade",
            }}
            name={SCREEN_NAMES.LOCK_APP_NAVIGATOR}
            component={LocalAuthorizationNavigator}
          />
          <AppStack.Screen
            name={SCREEN_NAMES.DETAILS_SCREEN}
            component={DetailsTransactionScreen}
            options={{
              title: "Detalles de la transacción",
              headerTitleAlign: "center",
              headerTitleStyle: styles.headerFontStyle,
              animation: Platform.OS === "ios" ? "default" : "fade",
              presentation: "formSheet",
              orientation: "portrait",
            }}
          />
          <AppStack.Screen
            name={SCREEN_NAMES.SEND_SETUP_SCREEN}
            component={SendSetupScreen}
            options={{
              title: "Enviar",
              headerTitleAlign: "center",
              headerTitleStyle: styles.headerFontStyle,
              presentation: "formSheet",
              orientation: "portrait",
            }}
          />
          <AppStack.Screen
            name={SCREEN_NAMES.SEND_CONFIRM_SCREEN}
            component={SendConfirmScreen}
            options={{
              title: "Trasladar",
              headerTitleAlign: "center",
              headerTitleStyle: styles.headerFontStyle,
              presentation: "formSheet",
              orientation: "portrait",
            }}
          />
          <AppStack.Screen
            name={SCREEN_NAMES.RECEIVE_SCREEN}
            component={ReceiveScreen}
            options={{
              title: "Recibir",
              headerTitleAlign: "center",
              headerTitleStyle: styles.headerFontStyle,
              presentation: "formSheet",
              orientation: "portrait",
            }}
          />
          <AppStack.Screen
            name={SCREEN_NAMES.GLOBAL_SETTINGS_SCREEN}
            component={GlobalSettingsScreen}
            options={{
              title: "Configuración de la aplicación",
              headerTitleAlign: "center",
              headerTitleStyle: styles.headerFontStyle,
            }}
          />
          <AppStack.Screen
            name={SCREEN_NAMES.SETTINGS_WALLET_ITEM}
            component={SettingsWalletItemScreen}
            options={{
              title: null,
              headerTransparent: true,
            }}
          />
          <AppStack.Screen
            name={SCREEN_NAMES.SETTINGS_WALLET_PUBLIC_KEY}
            component={WalletPublicKeyScreen}
            options={{
              title: "Llaves públicas",
              headerTitleAlign: "center",
              headerTitleStyle: styles.headerFontStyle,
              animation: "fade",
              headerTransparent: true,
              presentation: "transparentModal",
            }}
          />
          <AppStack.Screen
            name={SCREEN_NAMES.SETTINGS_WALLET_PRIVATE_KEY}
            component={WalletPrivateKeyScreen}
            options={{
              title: "Llaves privadas",
              headerTitleAlign: "center",
              headerTitleStyle: styles.headerFontStyle,
              animation: "fade",
              headerTransparent: true,
              presentation: "transparentModal",
            }}
          />
          <AppStack.Screen
            name={SCREEN_NAMES.SERVER_SETTINGS_SCREEN}
            component={ServerSettingsScreen}
            options={{
              title: "Configuración del servidor",
              headerTitleAlign: "center",
              headerTitleStyle: styles.headerFontStyle,
            }}
          />
          <AppStack.Screen
            name={SCREEN_NAMES.SECURITY_SETTINGS_SCREEN}
            component={SecuritySettingsScreen}
            options={{
              title: "Configuración de seguridad",
              headerTitleAlign: "center",
              headerTitleStyle: styles.headerFontStyle,
            }}
          />
          <AppStack.Screen
            name={SCREEN_NAMES.AUTO_LOCK_LIST_SCREEN}
            component={AutoLockListScreen}
            options={{
              title: "Automático",
              headerTitleAlign: "center",
              headerTitleStyle: styles.headerFontStyle,
            }}
          />
          <AppStack.Screen
            name={SCREEN_NAMES.QR_SCANNER_SCREEN}
            component={QrScannerScreen}
            options={{
              title: "QR",
              headerTitleAlign: "center",
              headerTitleStyle: styles.headerFontStyle,
              animation: Platform.OS === "ios" ? "default" : "fade",
              presentation: "fullScreenModal",
            }}
          />
        </AppStack.Group>

        {/* adding wallet */}
        <AppStack.Group screenOptions={({ navigation }) => ({
          animation: Platform.OS === "ios" ? "default" : "slide_from_right",
          title: "Añadiendo una billetera",
          headerTitleAlign: "center",
          headerTitleStyle: styles.headerFontStyle,
          headerLeft: (props) => (
            <BackNavigation
              title={"Volver"}
              navigation={navigation}
              {...props}
            />
          ),
        })}>
          <AppStack.Screen
            name={SCREEN_NAMES.ADD_WALLET_SCREEN}
            component={AddWalletScreen}
            options={({ navigation }) => ({
              headerLeft: (props) => (
                <BackNavigation
                  title={"Para la lista"}
                  navigation={navigation}
                  {...props}
                />
              ),
            })}
          />
          <AppStack.Screen
            name={SCREEN_NAMES.GENERATE_WALLET_SCREEN}
            component={GenerateWalletScreen}
          />
          <AppStack.Screen
            name={SCREEN_NAMES.IMPORT_WALLET_SCREEN}
            component={ImportWalletScreen}
          />
        </AppStack.Group>
      </AppStack.Group>
    </AppStack.Navigator>
  )
}

const styles = StyleSheet.create({
  headerFontStyle: {
    fontFamily: "Play-Bold",
    fontSize: 16,
    fontWeight: "normal",
  }
});
