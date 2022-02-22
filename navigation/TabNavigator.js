import React from 'react';
import { Image, View, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';

import { WalletTabScreen } from '../screen/WalletTabScreen';
import { ExchangeTabScreen } from '../screen/ExchangeTabScreen';
import { AnalyticsTabScreen } from '../screen/AnalyticsTabScreen';
import { SettingsWalletListScreen } from '../screen/SettingsWalletListScreen';
import { AnalyticsIcon, ExchangeIcon, SettingsIcon, WalletIcon } from '../component/Icons';
import TabShadow from '../assets/tabShadow.png';
import { active, greyPrimary, darkGrey, dark } from '../styles/color.theme';
import { deviceSize } from '../sdk/helper';
import { SCREEN_NAMES } from '../styles/constants';

const { height } = deviceSize;

const Tab = createBottomTabNavigator();
export function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      tabBarHideOnKeyboard: true,
      headerShown: false,
      tabBarIcon: ({ color, size }) => {
        let Icon;
        let disable;

        switch (route.name) {
          case SCREEN_NAMES.EXCHANGE_SCREEN:
            Icon = ExchangeIcon;
            disable = true;
            break;
          case SCREEN_NAMES.ANALYTICS_SCREEN:
            Icon = AnalyticsIcon;
            disable = true;
            break;
          case SCREEN_NAMES.SETTINGS_WALLET_LIST:
            Icon = SettingsIcon;
            disable = false;
            break;
          case SCREEN_NAMES.WALLET_SCREEN:
          default:
            Icon = WalletIcon;
            disable = false;
            break;
        }

        return (
          <View style={[styles.tabIcon, { backgroundColor: disable ? darkGrey : dark }]}>
            {
              !disable && <Image source={TabShadow} style={styles.shadowTabImage} />
            }

            <Icon size={17} color={color} />
          </View>
        );
      },
      tabBarActiveTintColor: active,
      tabBarInactiveTintColor: greyPrimary,
      tabBarStyle: styles.tabBar,
      tabBarLabelStyle: styles.tabBarLabel,
      tabBarItemStyle: styles.tabBarItem,
      tabBarBackground: () => (
        <>
          <View style={styles.barBackground} />
          {(
            route.name === SCREEN_NAMES.WALLET_SCREEN
            || route.name === SCREEN_NAMES.SETTINGS_WALLET_LIST
          ) && (
            <LinearGradient
              colors={['rgba(22,26,29,0)', dark]}
              style={styles.barBackgroundGradient}
              locations={[0, 0.65]}
            />
          )}
        </>
      ),
      tabBarButton: (props) => {
        let disable;

        switch (route.name) {
          case SCREEN_NAMES.EXCHANGE_SCREEN:
            disable = true;
            break;
          case SCREEN_NAMES.ANALYTICS_SCREEN:
            disable = true;
            break;
          case SCREEN_NAMES.SETTINGS_WALLET_LIST:
            disable = false;
            break;
          case SCREEN_NAMES.WALLET_SCREEN:
          default:
            disable = false;
            break;
        }
        const handler = !disable ? props.onPress : null

        return <TouchableOpacity {...props} onPress={handler} style={[...props.style ]}  />;
      }
    })}
    >
      <Tab.Screen
        name={SCREEN_NAMES.WALLET_SCREEN}
        component={WalletTabScreen}
        options={{
          tabBarLabel: "Billetera"
        }}
      />
      {/*<Tab.Screen*/}
      {/*  name={SCREEN_NAMES.EXCHANGE_SCREEN}*/}
      {/*  component={ExchangeTabScreen}*/}
      {/*  options={{*/}
      {/*    tabBarLabel: "Exchange"*/}
      {/*  }}*/}
      {/*/>*/}
      {/*<Tab.Screen*/}
      {/*  name={SCREEN_NAMES.ANALYTICS_SCREEN}*/}
      {/*  component={AnalyticsTabScreen}*/}
      {/*  options={{*/}
      {/*    tabBarLabel: "Analytics"*/}
      {/*  }}*/}
      {/*/>*/}
      <Tab.Screen
        name={SCREEN_NAMES.SETTINGS_WALLET_LIST}
        component={SettingsWalletListScreen}
        options={{
          tabBarLabel: "Configuración"
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    width: 44,
    height: 44,
    borderRadius: 50,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  shadowTabImage: {
    position: "absolute",
    width: 66,
    height: 66,
    top: "50%",
    left: "50%",
    transform: [{ translateY: -27 }, { translateX: -27 }],
  },
  tabBar: {
    position: 'absolute',
    height: 75,
    backgroundColor: "transparent",
    elevation: 0,
    borderTopWidth: 0,
    paddingBottom: 17,
  },
  tabBarLabel: {
    fontSize: 10,
    fontFamily: "Play-Regular",
  },
  tabBarItem: {
    justifyContent: "center",
    alignItems: "center",
  },
  barBackground: {
    height: 58,
    width: "100%",
    bottom: 0,
    position: "absolute",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    zIndex: 2,
    backgroundColor: dark,
  },
  barBackgroundGradient: {
    flex: 1,
    height: height * 0.2,
    position: "absolute",
    width: "100%",
    bottom: 0,
  },
});
