import React from 'react';
import { Platform } from 'react-native';
import { useSelector } from 'react-redux';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { PasscodeScreen } from '../screen/PasscodeScreen';
import { LockScreen } from '../screen/LockScreen';
import { SCREEN_NAMES } from '../styles/constants';

const LocalAuthStack = createNativeStackNavigator();
export function LocalAuthorizationNavigator({ navigation, route }) {
  const { toPath, fromPath, mode, routeParams } = route.params;
  const timeLocked = useSelector(state => state.app.timeLocked);

  return (
    <LocalAuthStack.Navigator screenOptions={{ headerShown: false }}>
      {
        timeLocked ? (
          <LocalAuthStack.Screen
            name={SCREEN_NAMES.LOCK_APP_SCREEN}
            component={LockScreen}
          />
        ) : (
          <LocalAuthStack.Screen
            name={SCREEN_NAMES.LOCAL_AUTH_SCREEN}
            component={PasscodeScreen}
            initialParams={{ toPath, fromPath, mode, routeParams }}
            options={{
              animation: Platform.OS === "ios" ? "default" : "fade",
              presentation: "formSheet",
            }}
          />
        )
      }
    </LocalAuthStack.Navigator>
  )
}
