import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Platform, StatusBar, AppState } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { AppNavigator } from './AppNavigator';
import { AddWalletNavigator } from './AddWalletNavigator';
import { LocalAuthorizationNavigator } from './LocalAuthorizationNavigator';
import { AppLoadingScreen } from '../screen/AppLoadingScreen';
import { ServerSettingsScreen } from '../screen/ServerSettingsScreen';
import { NetworkUrlErrorScreen } from '../screen/NetworkUrlErrorScreen';
import { CustomModal } from '../component/CustomModal';
import { BackNavigation } from '../component/BackNavigation';
import { checkGraphNetwork, checkSecure, checkTimeForReAuthorization } from '../store/app/actions';
import { navigationRef } from '../sdk/helper';
import { SCREEN_NAMES, LOCAL_AUTH_SCREEN_MODE, SECURE_STORE_NAMES } from '../styles/constants';
import { active, greyPrimary, lightDark } from '../styles/color.theme';
import { createIconSetFromFontello } from '@expo/vector-icons';

const DemobankTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    text: greyPrimary,
    background: lightDark,
  },
};

const Stack = createNativeStackNavigator();
export function RootNavigator() {
  const appState = useRef(AppState.currentState);
  const secureChecking = useSelector(state => state.app.secureChecking);
  const isLocalAuthenticated = useSelector(state => state.app.isLocalAuthenticated);
  const checkNetworkLoading = useSelector(state => state.app.checkNetworkLoading);
  const checkNetworkError = useSelector(state => state.app.checkNetworkError);
  const walletsLoading = useSelector(state => state.wallet.walletsLoading);
  const wallets = useSelector(state => state.wallet.wallets);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      //await dispatch(appPrepare());
      await dispatch(checkSecure());
      await dispatch(checkGraphNetwork());
    })();
    const subscription = AppState.addEventListener("change", handleAppState);

    return () => {
      if (subscription) {
        subscription.remove();
      } else {
        AppState.removeEventListener("change", handleAppState);
      }
    };
  }, []);

  const handleAppState = async (nextAppState) => {
    if (appState.current.match(/inactive|background/) && nextAppState === "active") {
      dispatch(checkTimeForReAuthorization());
    } else {
      const currentRoute = navigationRef.current.getCurrentRoute();

      let routeName = currentRoute.name;
      const routeParams = currentRoute.params || {};
      if (currentRoute.name === SCREEN_NAMES.LOCAL_AUTH_SCREEN || currentRoute.name === SCREEN_NAMES.LOCK_APP_SCREEN) {
        routeName = currentRoute.params.fromPath;
      }

      await AsyncStorage.setItem(
        SECURE_STORE_NAMES.EXIT_PROPS,
        JSON.stringify({
          routeName: routeName,
          routeParams: routeParams,
          exitTime: new Date().toISOString(),
        }),
      );
    }

    appState.current = nextAppState;
  };

  const renderContent = () => {

    console.log("checkNetworkError: " + checkNetworkError);
/*
    if (checkNetworkError) {
      return (
        <Stack.Group>
          <Stack.Screen
            name={SCREEN_NAMES.NETWORK_URL_ERROR_SCREEN}
            component={NetworkUrlErrorScreen}
          />
          <Stack.Screen
            name={SCREEN_NAMES.SERVER_SETTINGS_SCREEN}
            component={ServerSettingsScreen}
            options={({ navigation }) => ({
              headerShown: true,
              animation: Platform.OS === "ios" ? "default" : "slide_from_right",
              title: "Configuración del servidor",
              headerTitleAlign: "center",
              headerTitleStyle: {
                fontFamily: "Play-Bold",
                fontSize: 16,
                fontWeight: "normal",
              },
              headerTintColor: active,
              headerLeft: (props) => (
                <BackNavigation
                  title={"Atrás"}
                  navigation={navigation}
                  {...props}
                />
              ),
              headerStyle: { backgroundColor: lightDark },
              headerShadowVisible: false,
            })}
          />
        </Stack.Group>
      );
    }
*/
    if (secureChecking || walletsLoading || checkNetworkLoading) {
      return (
        <Stack.Screen
          name={SCREEN_NAMES.APP_LOADING_SCREEN}
          component={AppLoadingScreen}
        />
      );
    }

    if (!isLocalAuthenticated) {
      return (
        <Stack.Screen
          name={SCREEN_NAMES.LOCK_APP_NAVIGATOR}
          component={LocalAuthorizationNavigator}
          initialParams={{ mode: LOCAL_AUTH_SCREEN_MODE.AUTH_IN_APP, toPath: SCREEN_NAMES.APP_LOADING_SCREEN }}
        />
      );
    }

    if (wallets.length === 0) {
      return (
        <Stack.Screen
          name={SCREEN_NAMES.ADD_WALLET_NAVIGATOR}
          component={AddWalletNavigator}
        />
      )
    }

    return (
      <Stack.Screen
        name={SCREEN_NAMES.APP_NAVIGATOR}
        component={AppNavigator}
      />
    )
  };

  return (
    <NavigationContainer
      theme={DemobankTheme}
      ref={navigationRef}
    >
      <StatusBar
        barStyle={"light-content"}
        translucent={true}
      />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {renderContent()}

        <Stack.Group screenOptions={{
            presentation: "transparentModal",
            animation: "fade",
          }}>
          <Stack.Screen
            name={SCREEN_NAMES.MODAL_SCREEN}
            component={CustomModal}
          />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
