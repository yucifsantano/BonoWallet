import AsyncStorage from '@react-native-async-storage/async-storage';
import { BackHandler } from 'react-native';

import Types from './types';
import AppTypes from '../app/types';
import { saveToDeviceStorage, getValueFromDeviceStorage } from '../../sdk/helper';
import { createWallet, importWalletPrivateKey } from '../../sdk/wallet';
import { showModalAction } from '../modal/actions';
import { navigate } from '../../sdk/helper';
import { SECURE_STORE_NAMES, SCREEN_NAMES, AUTO_LOCK } from '../../styles/constants';

export const generateWalletAction = () => async (dispatch) => {
  dispatch({ type: Types.WALLET_LOAD_START });

  try {
    let address = undefined;
    let privateKey = undefined;
    let publicKey = undefined;

    // generate new wallet
    await new Promise((resolve) => {
      setTimeout(() => {
        const result = createWallet();
        address = result.address;
        privateKey = result.privateKey;
        publicKey = result.publicKey;
        resolve();
      }, 0);
    });

    // get all previous wallets from secure store
    const walletsStringified = await getValueFromDeviceStorage(SECURE_STORE_NAMES.WALLETS);
    const oldWalletsList = JSON.parse(walletsStringified) || [];
    // concatenate all previous wallets from secure store with new one
    const newWallets = [...oldWalletsList, { address, privateKey, publicKey, name: `Billetera principal ${oldWalletsList.length + 1}` }];
    // save new wallets list to secure store for next sign in process (startApp action)
    await saveToDeviceStorage(SECURE_STORE_NAMES.WALLETS, JSON.stringify(newWallets));
    dispatch({ type: Types.WALLET_LIST_LOAD_SUCCESS, payload: newWallets });
    await dispatch(getWalletDataAction({ address: address }));

    if (oldWalletsList.length > 0) {
      // push user to wallets lst
      navigate(SCREEN_NAMES.SETTINGS_WALLET_LIST);
    }
    dispatch(showModalAction({ type: "success", text: "Su billetera fue creada exitosamente" }));
  } catch (e) {
    console.error(e);
    dispatch({ type: Types.WALLET_LOAD_ERROR, payload: e });
    dispatch(showModalAction({ type: "error", text: "Hubo un problema al crear la billetera." }));
  } finally {
    dispatch({ type: Types.WALLET_LOAD_FINISH });
  }
};

export const importWalletAction = ({ privateKey }) => async (dispatch) => {
  dispatch({ type: Types.WALLET_LOAD_START });

  try {
    const importedWallet = {
      address: undefined,
      privateKey: undefined,
      publicKey: undefined,
    };

    // import wallet
    await new Promise((resolve) => {
      setTimeout(() => {
        const result = importWalletPrivateKey(privateKey);
        importedWallet.address = result.address;
        importedWallet.privateKey = result.privateKey;
        importedWallet.publicKey = result.publicKey;
        resolve();
      }, 0);
    });

    // get all previous wallets from secure store
    const walletsStringified = await getValueFromDeviceStorage(SECURE_STORE_NAMES.WALLETS);
    const oldWalletsList = JSON.parse(walletsStringified) || [];

    if (oldWalletsList.length > 0) {
      const isWalletExist = oldWalletsList.find(w => w.address === importedWallet.address);
      if (isWalletExist) {
        // push user to wallets lst
        navigate(SCREEN_NAMES.SETTINGS_WALLET_LIST);
        dispatch(showModalAction({ type: "success", text: "La billetera importada ya existe en la lista de tus billeteras." }));
        return;
      }
    }

    // concatenate all previous wallets from secure store with new one
    const newWallets = [...oldWalletsList, { ...importedWallet, name: `Billetera principal ${oldWalletsList.length + 1}` }];
    // save new wallets list to secure store for next sign in process (startApp action)
    await saveToDeviceStorage(SECURE_STORE_NAMES.WALLETS, JSON.stringify(newWallets));
    dispatch({ type: Types.WALLET_LIST_LOAD_SUCCESS, payload: newWallets });
    await dispatch(getWalletDataAction({ address: importedWallet.address }));

    if (oldWalletsList.length > 0) {
      // push user to wallets lst
      navigate(SCREEN_NAMES.SETTINGS_WALLET_LIST);
    }
    dispatch(showModalAction({ type: "success", text: "Su billetera fue importada con éxito" }));
  } catch (e) {
    console.error(e);
    dispatch({ type: Types.WALLET_LOAD_ERROR, payload: e });
    dispatch(showModalAction({ type: "error", text: "Hubo un problema al importar su billetera." }));
  } finally {
    dispatch({ type: Types.WALLET_LOAD_FINISH });
  }
};

export const getWalletsList = () => async (dispatch) => {
  dispatch({ type: Types.WALLET_LIST_LOAD_START });

  try {
    // get all wallets from secure store
    const stringifiedWallets = await getValueFromDeviceStorage(SECURE_STORE_NAMES.WALLETS);

    if (!stringifiedWallets) {
      return dispatch({ type: Types.WALLET_LIST_LOAD_SUCCESS, payload: [] });
    }

    const wallets = JSON.parse(stringifiedWallets);
    // stored wallets from secure store to redux store
    dispatch({ type: Types.WALLET_LIST_LOAD_SUCCESS, payload: wallets });
    // get active wallet address
    const activeWalletAddress = JSON.parse(await AsyncStorage.getItem(SECURE_STORE_NAMES.ACTIVE_WALLET_ADDRESS)) || wallets[0].address;
    await dispatch(getWalletDataAction({ address: activeWalletAddress }));
  } catch (e) {
    console.error(e);
    dispatch({ type: Types.WALLET_LIST_LOAD_ERROR, payload: e });
    dispatch(showModalAction({
      type: "error",
      text: "Hubo un problema al verificar el almacenamiento local." +
        " Si el error persiste, restablezca la configuración de caché y ejecute la aplicación",
      onClose: BackHandler.exitApp,
      onCloseText: "Cerrar",
      isFullScreen: true,
    }));
  } finally {
    dispatch({ type: Types.WALLET_LIST_LOAD_FINISH });
  }
};

export const getWalletDataAction = ({ address }) => async (dispatch, getState) => {
  dispatch({ type: Types.WALLET_LOAD_START });

  try {
    // save the wallet's address as active to local devise store
    await AsyncStorage.setItem(SECURE_STORE_NAMES.ACTIVE_WALLET_ADDRESS, JSON.stringify(address));
    const store = getState();
    const { configUrl } = store.app;

    const response = await fetch(`${configUrl}/balance?address=${address}`);
    const { data } = await response.json();

    dispatch({
      type: Types.WALLET_LOAD_SUCCESS,
      payload: {
        address: address,
        balance: data.balance,
        transactions: data.transactions,
      },
    });
  } catch (e) {
    console.error(e);
    dispatch({ type: Types.WALLET_LOAD_ERROR, payload: e });
    dispatch(showModalAction({ type: "error", text: "Hubo un problema al cargar los datos de la billetera." }));
  } finally {
    dispatch({ type: Types.WALLET_LOAD_FINISH });
  }
};

export const changeWalletName = ({ newName, walletAddress }) => async (dispatch, getState) => {
  const store = getState();
  const { wallets } = store.wallet;

  const changedWalletIndex = wallets.findIndex(wallet => wallet.address === walletAddress);
  const updatedWalletList = [
    ...wallets.slice(0, changedWalletIndex),
    {
      ...wallets[changedWalletIndex],
      name: newName === "" ? `Sin título ${changedWalletIndex + 1}` : newName,
    },
    ...wallets.slice(changedWalletIndex + 1),
  ];

  await saveToDeviceStorage(SECURE_STORE_NAMES.WALLETS, JSON.stringify(updatedWalletList));
  dispatch({ type: Types.WALLET_LIST_LOAD_SUCCESS, payload: updatedWalletList });
};

export const deleteWalletAction = ({ address }) => async (dispatch) => {
  try {
    const stringifiedWallets = await getValueFromDeviceStorage(SECURE_STORE_NAMES.WALLETS);
    const wallets = JSON.parse(stringifiedWallets);
    const newWallets = wallets.filter(wallet => wallet.address !== address);
    await saveToDeviceStorage(SECURE_STORE_NAMES.WALLETS, JSON.stringify(newWallets));
    dispatch({ type: Types.WALLET_LIST_LOAD_SUCCESS, payload: newWallets });
    if (newWallets.length > 0) {
      await dispatch(getWalletDataAction({ address: newWallets[0].address }));
    } else {
      await AsyncStorage.multiRemove([
        SECURE_STORE_NAMES.PASSCODE,
        SECURE_STORE_NAMES.BIOMETRIC_IS_ON,
        SECURE_STORE_NAMES.AUTO_LOCK,
      ]);

      dispatch({ type: AppTypes.CHANGE_IS_PASSCODE_EXIST, payload: false });
      dispatch({ type: AppTypes.CHANGE_BIOMETRIC_IS_ON, payload: false });
      dispatch({ type: AppTypes.CHANGE_AUTO_LOCK_VALUE, payload: AUTO_LOCK.FIVE_MINUTES });
    }
  } catch (e) {
    console.error(e);
    dispatch({ type: Types.WALLET_LOAD_ERROR, payload: e });
    dispatch(showModalAction({ type: "error", text: "Hubo un problema al retirar la billetera." }));
  }
};

export const sendToWallet = ({ from, to, amount, putSymbol }) => async (dispatch) => {
  console.log(from, to, amount, putSymbol);
};
