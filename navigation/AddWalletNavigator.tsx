import React from 'react';
import { Platform } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AddWalletScreen } from '../screen/AddWalletScreen';
import { GenerateWalletScreen } from '../screen/GenerateWalletScreen';
import { ImportWalletScreen } from '../screen/ImportWalletScreen';
import { BackNavigation } from '../component/BackNavigation';
import { active, lightDark } from '../styles/color.theme';
import { SCREEN_NAMES } from '../styles/constants';

const AddWalletStack = createNativeStackNavigator();
export function AddWalletNavigator() {
  return (
    <AddWalletStack.Navigator screenOptions={{ headerShown: false }}>
      <AddWalletStack.Screen
        name={SCREEN_NAMES.ADD_WALLET_SCREEN}
        component={AddWalletScreen}
        options={{
          animation: Platform.OS === "ios" ? "default" : "slide_from_right",
        }}
      />
      <AddWalletStack.Group screenOptions={({ navigation }) => ({
        headerShown: true,
        animation: Platform.OS === "ios" ? "default" : "slide_from_right",
        title: null,
        headerTintColor: active,
        headerLeft: (props) => (
          <BackNavigation
            title={"Volver"}
            navigation={navigation}
            {...props}
          />
        ),
        headerTransparent: true,
        headerStyle: { backgroundColor: lightDark },
        headerShadowVisible: false,
      })}>
        <AddWalletStack.Screen
          name={SCREEN_NAMES.GENERATE_WALLET_SCREEN}
          component={GenerateWalletScreen}
        />
        <AddWalletStack.Screen
          name={SCREEN_NAMES.IMPORT_WALLET_SCREEN}
          component={ImportWalletScreen}
        />
      </AddWalletStack.Group>
    </AddWalletStack.Navigator>
  );
}
