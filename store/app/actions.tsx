import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';

import Types from './types';
import { showModalAction } from '../modal/actions';
import { getWalletsList } from '../wallet/actions';
import { replace, navigate } from '../../sdk/helper';
import {
  SECURE_STORE_NAMES,
  DEFAULT_RESOURCES,
  BIOMETRIC_METHOD,
  SCREEN_NAMES,
  LOCAL_AUTH_SCREEN_MODE,
  AUTO_LOCK,
} from '../../styles/constants';

export const checkSecure = () => async (dispatch) => {

  console.log('*** DENTRO DE LA FUNCION: checkSecure()')

  dispatch({ type: Types.SECURE_CHECKING_START });
  try {
    // check if user should enter passcode
    const isPasscodeExist = await AsyncStorage.getItem(SECURE_STORE_NAMES.PASSCODE);

    // check secure settings if passcode exist
    if (!!isPasscodeExist) {
      // check if app is locked
      const timeLocked = await AsyncStorage.getItem(SECURE_STORE_NAMES.TIME_APP_LOCKED);
      const autoLockValue = await AsyncStorage.getItem(SECURE_STORE_NAMES.AUTO_LOCK) || AUTO_LOCK.FIVE_MINUTES;
      dispatch({ type: Types.CHANGE_APP_LOCKED_TIME, payload: timeLocked });
      dispatch({ type: Types.CHANGE_AUTO_LOCK_VALUE, payload: autoLockValue });

      dispatch({ type: Types.CHANGE_IS_PASSCODE_EXIST, payload: true });
    }

    const isSupported = await LocalAuthentication.hasHardwareAsync();
    if (isSupported) {
      const isSaved = await LocalAuthentication.isEnrolledAsync();
      if (isSaved) {
        let method;
        let biometricIsOn = await AsyncStorage.getItem(SECURE_STORE_NAMES.BIOMETRIC_IS_ON);
        if (biometricIsOn) biometricIsOn = JSON.parse(biometricIsOn);
        const kindAvailable = await LocalAuthentication.supportedAuthenticationTypesAsync();

        if (kindAvailable.length) {
          if (kindAvailable.includes(2)) {
            method = BIOMETRIC_METHOD.FACE_ID;
          } else if (kindAvailable.includes(1)) {
            method = BIOMETRIC_METHOD.FINGERPRINT;
          } else {
            biometricIsOn = false;
            method = BIOMETRIC_METHOD.NONE;
          }
        } else {
          biometricIsOn = false;
          method = BIOMETRIC_METHOD.NONE;
        }

        dispatch({ type: Types.CHANGE_BIOMETRIC_IS_ON, payload: biometricIsOn });
        dispatch({ type: Types.CHANGE_BIOMETRIC_METHOD, payload: method });
      }
    }

    dispatch({ type: Types.CHANGE_IS_LOCAL_AUTHENTICATED, payload: !(!!isPasscodeExist) });
  } catch (e) {
    dispatch(showModalAction({
      type: "error",
      text: "Ha habido un problema al descargar los datos.",
    }));
  } finally {
    dispatch({ type: Types.SECURE_CHECKING_FINISH });
  }
};

export const checkTimeForReAuthorization = () => async (dispatch, getState) => {
  try {
    const store = getState();
    const isPasscodeExist = store.app.isPasscodeExist;

    if (isPasscodeExist) {
      const autoLockValue = store.app.autoLockValue;
      const { exitTime, routeName, routeParams } = JSON.parse(await AsyncStorage.getItem(SECURE_STORE_NAMES.EXIT_PROPS));
      const timeWithoutReAuth = new Date(exitTime).getTime() + +autoLockValue;
      const currentTime = new Date().getTime();

      if (currentTime > timeWithoutReAuth) {
        navigate(
          SCREEN_NAMES.LOCK_APP_NAVIGATOR,
          {
            toPath: SCREEN_NAMES[routeName],
            mode: LOCAL_AUTH_SCREEN_MODE.APP_STATE_BECOME_ACTIVE,
            routeParams: routeParams,
          }
        )
      } else {
        await AsyncStorage.removeItem(SECURE_STORE_NAMES.EXIT_PROPS);
      }
    }
  } catch (e) {
    console.error(e);
    dispatch(showModalAction({
      type: "error",
      text: "Ha habido un problema al descargar los datos.",
    }));
  }
};

export const getProfileAction = () => async (dispatch) => {
  try {
    const profile = await AsyncStorage.getItem(SECURE_STORE_NAMES.PROFILE);

    if (profile) {
      const { name, surname } = JSON.parse(profile);
      dispatch({ type: Types.CHANGE_PROFILE, payload: { name, surname } });
    }
  } catch (e) {
    console.error(e);
    dispatch(showModalAction({
      type: "error",
      text: "Hubo un problema al cargar el perfil.",
    }));
  }
};

export const saveProfileAction = ({ name, surname }) => async (dispatch) => {
  try {
    const data = JSON.stringify({ name, surname });
    await AsyncStorage.setItem(SECURE_STORE_NAMES.PROFILE, data);
    dispatch(showModalAction({
      type: "success",
      text: "Tu perfil ha sido actualizado exitosamente.",
    }));
    dispatch({ type: Types.CHANGE_PROFILE, payload: { name, surname } });
  } catch (e) {
    console.error(e);
    dispatch(showModalAction({
      type: "error",
      text: "Hubo un problema al editar los campos de perfil.",
    }));
  }
};

export const checkGraphNetwork = () => async (dispatch) => {
  dispatch({ type: Types.CHECK_NETWORK_START });

  try {
    // check graph network
    const graphNetworkUrl = JSON.parse(await AsyncStorage.getItem(SECURE_STORE_NAMES.GRAPH_NETWORK_URL)) || DEFAULT_RESOURCES.graphNetworkUrl;

    if (DEFAULT_RESOURCES.graphNetworkUrl !== graphNetworkUrl) {
      dispatch({
        type: Types.CHECK_NETWORK_SUCCESS,
        payload: {
          configUrl: graphNetworkUrl,
        }
      });
    }

    const response = await fetch(graphNetworkUrl);
    const { message } = await response.json();

    dispatch({
      type: Types.CHECK_NETWORK_SUCCESS,
      payload: {
        configUrl: graphNetworkUrl,
        network: message.network,
        gnn: JSON.stringify(message.gnn),
        status: message.status,
      },
    });

    // get wallets from storage
    await dispatch(getWalletsList());
  } catch (e) {
    console.error(e);
    dispatch({ type: Types.CHECK_NETWORK_ERROR, payload: e });
  } finally {
    dispatch({ type: Types.CHECK_NETWORK_FINISH });
  }
};

export const saveServerAction = ({ configUrl, network }) => async (dispatch) => {
  try {
    dispatch({ type: Types.CHANGE_NETWORK_CONFIG, payload: { configUrl, network } });

    const configUrlStr = JSON.stringify(configUrl);
    await AsyncStorage.setItem(SECURE_STORE_NAMES.GRAPH_NETWORK_URL, configUrlStr);
    await dispatch(checkGraphNetwork());
  } catch (e) {
    console.error(e);
    dispatch(showModalAction({
      type: "error",
      text: "Ha habido un problema al editar los campos de configuración del servidor",
    }));
  }
};

export const unlockAppAction = () => async (dispatch) => {
  dispatch({ type: Types.CHANGE_APP_LOCKED_TIME, payload: null });
  await AsyncStorage.removeItem(SECURE_STORE_NAMES.TIME_APP_LOCKED);
}
