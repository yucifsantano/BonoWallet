import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SafeAreaView, View, StyleSheet, Platform, Animated, ActivityIndicator, Vibration } from 'react-native';
import { Ionicons, MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';

import { CustomText } from '../component/CustomText';
import { CircleBtn } from '../component/CircleBtn';
import { StatusBarHeight, deviceSize } from '../sdk/helper';
import { textWhite, active, darkGrey, dark } from '../styles/color.theme';
import { LOCAL_AUTH_SCREEN_MODE, SECURE_STORE_NAMES, BIOMETRIC_METHOD, AUTO_LOCK } from '../styles/constants';
import Types from '../store/app/types';

const { width } = deviceSize;

const codeLength = 6;
const maxAttemptsCount = 5;

const CodeInput = ({ value }) => {
  return (
    <View
      style={[styles.codeItem, { backgroundColor: value ? active : "transparent" }]}
    />
  )
}

export function PasscodeScreen({ navigation, route }) {
  const { toPath, mode, routeParams } = route.params;
  // animation
  const incorrectDoteAnimation = useRef(new Animated.Value(0)).current;
  const incorrectLockAnimation = useRef(new Animated.Value(0)).current;
  // passcode
  const [code, setCode] = useState("");
  // passcode repeating
  const [tempCode, setTempCode] = useState("");
  // create | repeat | delete | confirm | auth_in_app
  const [screenMode, setScreenMode] = useState(mode);
  // count of attempts
  const [attemptsCount, setAttemptsCount] = useState(0);
  const biometricIsOn = useSelector(state => state.app.biometricIsOn);
  const biometricMethod = useSelector(state => state.app.biometricMethod);
  const timeLocked = useSelector(state => state.app.timeLocked);
  // keyboard rows
  const numbers = [["1", "2", "3"], ["4", "5", "6"], ["7", "8", "9"], ['bio', "0", 'del']];
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const getAttemptsCount = async () => {
    const attemptsCountStr = await AsyncStorage.getItem(SECURE_STORE_NAMES.ATTEMPTS_COUNT);
    const currentAttemptsCount = attemptsCountStr ? +attemptsCountStr : 0;
    setAttemptsCount(currentAttemptsCount);
  };

  useEffect(() => {
    (async () => {
      await getAttemptsCount();

      if (
        !biometricIsOn
        || screenMode === LOCAL_AUTH_SCREEN_MODE.CREATE_PASSCODE
        || screenMode === LOCAL_AUTH_SCREEN_MODE.REPEAT_PASSCODE
      ) return;

      await checkBiometric();
    })();
  }, []);

  useEffect(() => {
    (async () => {
      await getAttemptsCount()
    })();
  }, [timeLocked]);

  useEffect(() => {
    (async () => {
      if (code.length === codeLength) {
        await handleCheckLocalCode(false);
      }
    })();
  }, [code]);

  const checkBiometric = async () => {
    const isSupported = await LocalAuthentication.hasHardwareAsync();
    if (isSupported) {
      const isSaved = await LocalAuthentication.isEnrolledAsync();
      if (isSaved) {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: "Login with ...",
          cancelLabel: "PIN",
          disableDeviceFallback: true,
        });

        if (result.success) {
          await handleCheckLocalCode(true);
        }
      }
    }
  };

  const handleCheckLocalCode = async (successWithBiometric = false) => {
    if (screenMode === LOCAL_AUTH_SCREEN_MODE.CREATE_PASSCODE) {
      setTempCode(code);
      setCode("");
      setScreenMode(LOCAL_AUTH_SCREEN_MODE.REPEAT_PASSCODE);
      return;
    }

    if (
      screenMode === LOCAL_AUTH_SCREEN_MODE.CONFIRM_PASSCODE
      || screenMode === LOCAL_AUTH_SCREEN_MODE.AUTH_IN_APP
      || screenMode === LOCAL_AUTH_SCREEN_MODE.DELETE_PASSCODE
      || screenMode === LOCAL_AUTH_SCREEN_MODE.APP_STATE_BECOME_ACTIVE
    ) {
      setLoading(true);
      const passcode = await AsyncStorage.getItem(SECURE_STORE_NAMES.PASSCODE);
      if (passcode === code || successWithBiometric) {
        await AsyncStorage.multiRemove([
          SECURE_STORE_NAMES.TIME_APP_LOCKED,
          SECURE_STORE_NAMES.ATTEMPTS_COUNT,
        ]);
        if (screenMode === LOCAL_AUTH_SCREEN_MODE.AUTH_IN_APP) {
          dispatch({ type: Types.CHANGE_IS_LOCAL_AUTHENTICATED, payload: true });
        } else {
          if (screenMode === LOCAL_AUTH_SCREEN_MODE.DELETE_PASSCODE) {
            await AsyncStorage.multiRemove([
              SECURE_STORE_NAMES.PASSCODE,
              SECURE_STORE_NAMES.BIOMETRIC_IS_ON,
              SECURE_STORE_NAMES.AUTO_LOCK,
            ]);
            dispatch({ type: Types.CHANGE_BIOMETRIC_IS_ON, payload: false });
            dispatch({ type: Types.CHANGE_IS_PASSCODE_EXIST, payload: false });
            dispatch({ type: Types.CHANGE_AUTO_LOCK_VALUE, payload: AUTO_LOCK.FIVE_MINUTES });
          }
          setLoading(false);

          if (screenMode === LOCAL_AUTH_SCREEN_MODE.APP_STATE_BECOME_ACTIVE) {
            navigation.navigate(toPath, routeParams);
          } else {
            navigation.replace(toPath);
          }
        }
      } else {
        await handleFailure({ repeatPasscodeScreen: false });
      }
    } else if (screenMode === LOCAL_AUTH_SCREEN_MODE.REPEAT_PASSCODE) {
      setLoading(true);

      if (code === tempCode) {
        await AsyncStorage.setItem(SECURE_STORE_NAMES.PASSCODE, code);
        dispatch({ type: Types.CHANGE_IS_PASSCODE_EXIST, payload: true });
        setLoading(false);
        navigation.replace(toPath);
      } else {
        await handleFailure({ repeatPasscodeScreen: true });
      }
    }
  };

  const handleFailure = async ({ repeatPasscodeScreen = false }) => {
    setLoading(false);

    showIncorrectAnimation();
    Vibration.vibrate();

    if (!repeatPasscodeScreen) {
      const currentAttemptsCount = attemptsCount + 1;
      setAttemptsCount(currentAttemptsCount);

      if (currentAttemptsCount >= maxAttemptsCount) {
        const timeLockedApp = new Date().toISOString();
        await AsyncStorage.setItem(SECURE_STORE_NAMES.TIME_APP_LOCKED, timeLockedApp);
        dispatch({ type: Types.CHANGE_APP_LOCKED_TIME, payload: timeLockedApp });
        await AsyncStorage.removeItem(SECURE_STORE_NAMES.ATTEMPTS_COUNT);
      } else {
        await AsyncStorage.setItem(SECURE_STORE_NAMES.ATTEMPTS_COUNT, currentAttemptsCount.toString());
      }
    }

    setCode("");
    if (repeatPasscodeScreen) {
      setTempCode("");
      setScreenMode(LOCAL_AUTH_SCREEN_MODE.CREATE_PASSCODE);
    }
  };

  const handlePress = async (value) => {
    if (code.length > codeLength) return;

    const currentCode = code + value;
    setCode(currentCode);
  };

  const handleDelLastSymbol = () => {
    if (code.length > 0) {
      setCode(code.slice(0, -1));
    }
  };

  const getBiometricIcon = () => {
    switch (biometricMethod) {
      case BIOMETRIC_METHOD.FACE_ID:
        return "face-recognition";
      case BIOMETRIC_METHOD.FINGERPRINT:
        return "fingerprint";
    }
  };

  const getBiometricButton = (item, index) => {
    if (
      biometricIsOn
      && screenMode !== LOCAL_AUTH_SCREEN_MODE.CREATE_PASSCODE
      && screenMode !== LOCAL_AUTH_SCREEN_MODE.REPEAT_PASSCODE
    ) {
      return (
        <CircleBtn
          key={index + item}
          size={75}
          style={[styles.number]}
          Icon={() => (
            <MaterialCommunityIcons
              name={getBiometricIcon()}
              size={30}
              color={textWhite}
            />
          )}
          onPress={checkBiometric}
        />
      );
    } else {
      return (
        <View
          key={index + item}
          style={[
            styles.number,
            { width: 75, backgroundColor: "transparent" },
          ]}
        />
      );
    }
  };

  let title, iconName;
  switch (screenMode) {
    case LOCAL_AUTH_SCREEN_MODE.CONFIRM_PASSCODE:
    case LOCAL_AUTH_SCREEN_MODE.AUTH_IN_APP:
    case LOCAL_AUTH_SCREEN_MODE.APP_STATE_BECOME_ACTIVE:
    case LOCAL_AUTH_SCREEN_MODE.DELETE_PASSCODE:
      title = "Ingrese su contraseña";
      iconName = "lock-closed";
      break;
    case LOCAL_AUTH_SCREEN_MODE.REPEAT_PASSCODE:
      title = "Ingrese su contraseña de nuevo";
      iconName = "create";
      break;
    case LOCAL_AUTH_SCREEN_MODE.CREATE_PASSCODE:
      title = "Introduzca una nueva contraseña";
      iconName = "create-outline";
      break;
    default:
      title = "";
      iconName = "";
  }

  if (attemptsCount > 0) {
    title = `Contraseña inválida. ${maxAttemptsCount - attemptsCount} Intento`;
  }

  if (attemptsCount >= maxAttemptsCount) {
    title = `Contraseña inválida.`;
  }

  const animatedCodeContainerStyle = {
    transform: [{
      translateX: incorrectDoteAnimation.interpolate({
        inputRange: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
        outputRange: [0, -10, 0, -10, 0, -10, 0, -10, 0, -10, 0],
      })
    }],
  };

  const animatedLockContainerStyle = {
    transform: [
      {
        rotateZ: incorrectDoteAnimation.interpolate({
          inputRange: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
          outputRange: ["0deg", "-30deg", "0deg", "30deg", "0deg", "-30deg", "0deg", "30deg", "0deg", "-30deg", "0deg"],
        }),
      },
      {
        translateX: incorrectDoteAnimation.interpolate({
          inputRange: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
          outputRange: [0, -6, 0, 6, 0, -6, 0, 6, 0, -6, 0],
        }),
      },
    ],
  };

  const showIncorrectAnimation = () => {
    incorrectDoteAnimation.setValue(0);
    incorrectLockAnimation.setValue(0);
    Animated.timing(incorrectDoteAnimation, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true
    }).start();
    Animated.timing(incorrectLockAnimation, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true
    }).start();
  }

  return (
    <SafeAreaView style={styles.container}>
      {
        loading ? (
          <Animated.View style={[styles.lockIconContainer, animatedLockContainerStyle]}>
            <ActivityIndicator color={active} size={"large"} />
          </Animated.View>
        ) : (
          <Animated.View style={[styles.lockIconContainer, animatedLockContainerStyle]}>
            <Ionicons name={iconName} size={36} color={textWhite} />
          </Animated.View>
        )
      }
      <View style={styles.passcodeContainer}>
        <CustomText
          align={'center'}
          size={18}
        >
          {title}
        </CustomText>
        <Animated.View style={[styles.codeContainer, animatedCodeContainerStyle]}>
          {
            Array.from({ length: 6 }).map((c, index) => (
              <CodeInput
                value={code[index]}
                key={"code-view-" + index}
              />
            ))
          }
        </Animated.View>
      </View>
      <View style={styles.numberWrapper}>
        <View style={[styles.numbersContainer]}>
          {
            numbers.map((row, index) => (
              <View
                key={index}
                style={styles.numbersRow}
              >
                {row.map(item => {
                  if (item === "bio") {
                    return getBiometricButton(item, index);
                  }

                  if (item === "del") {
                    return (
                      <CircleBtn
                        key={index + item}
                        size={75}
                        style={[styles.number]}
                        disabled={!code.length}
                        Icon={() => <Entypo name="erase" size={30} color={textWhite} />}
                        onPress={handleDelLastSymbol}
                      />
                    );
                  }

                  return (
                    <CircleBtn
                      key={index + item}
                      size={75}
                      style={styles.number}
                      onPress={() => handlePress(item)}
                    >
                      <CustomText size={36}>
                        {item}
                      </CustomText>
                    </CircleBtn>
                  )
                })}
              </View>
            ))
          }
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBarHeight : 0,
    justifyContent: "space-around",
    alignItems: "center",
  },
  lockIconContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 100,
  },
  passcodeContainer: {
    alignItems: "center",
    justifyContent: "space-around",
    height: 150,
    width: width - (24 * 2),
    marginHorizontal: 24,
    backgroundColor: dark,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: active,
  },
  codeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  codeItem: {
    width: 24,
    margin: 12,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: active,
  },
  codeActiveItem: {
    backgroundColor: active,
  },
  numberWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  numbersContainer: {
    width: width,
    marginTop: 24,
    marginBottom: 60,
  },
  numbersRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  number: {
    margin: 12,
    borderRadius: 75,
    backgroundColor: darkGrey,
    justifyContent: "center",
    alignItems: "center",
  },
});
