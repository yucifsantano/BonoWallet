import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, StyleSheet } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { AntDesign } from '@expo/vector-icons';

import { CustomText } from '../component/CustomText';
import { GoToButton } from '../component/GoToButton';
import { CustomInput } from '../component/CustomInput';
import { CustomButton } from '../component/CustomButton';
import { changeWalletName } from '../store/wallet/actions';
import { showModalAction } from '../store/modal/actions';
import { deleteWalletAction } from '../store/wallet/actions';
import { StatusBarHeight } from '../sdk/helper';
import { danger07, danger, greySecondary, dark } from '../styles/color.theme';
import { SCREEN_NAMES } from '../styles/constants';

export function SettingsWalletItem({ walletAddress, navigation, insideBottomSheet = false }) {
  const wallet = useSelector(state => state.wallet.wallets.find(w => w.address === walletAddress));
  const loading = useSelector(state => state.wallet.loading);
  const dispatch = useDispatch();
  const headerHeight = useHeaderHeight();

  const handleNameChange = (value) => {
    dispatch(changeWalletName({ newName: value, walletAddress: wallet.address }));
  };

  const handleDelete = () => {
    navigation.navigate(SCREEN_NAMES.SETTINGS_WALLET_LIST);
    dispatch(deleteWalletAction({ address: walletAddress }));
  };

  const showDeleteModal = () => {
    dispatch(showModalAction({
      type: "info",
      text: `Realmente quiere quitar la billetera ${wallet.name}?\nLe recomendamos que guarde la llave privada para restaurar`,
      closeOnOverlay: true,
      onCloseText: "Cancelar",
      onClick: handleDelete,
      onClickLoading: loading,
      onClickText: "Eliminar",
      onClickBgColor: danger,
    }));
  };

  const showPublicKey = () => {
    navigation.navigate(SCREEN_NAMES.SETTINGS_WALLET_PUBLIC_KEY, { publicKey: wallet.publicKey });
  };

  const showPrivateKey = () => {
    navigation.navigate(SCREEN_NAMES.SETTINGS_WALLET_PRIVATE_KEY, { privateKey: wallet.privateKey });
  };

  return (
    <View
      style={[
        styles.container,
        { marginTop: !!headerHeight ? headerHeight : StatusBarHeight  },
        { paddingTop: insideBottomSheet ? 0 : 20 }
      ]}
    >
      <CustomInput
        isInsideBottomSheet={insideBottomSheet}
        value={wallet?.name}
        label={"Nombre"}
        editable={!loading}
        placeholder={"Ingrese el nombre de la billetera ..."}
        containerStyle={styles.nameInput}
        onChangeText={handleNameChange}
      />
      <CustomText
        color={'greySecondary'}
        size={12}
        style={[{ marginBottom: 12, paddingHorizontal: 12 }]}
      >
        Opciones de respaldo
      </CustomText>
      <GoToButton
        // TODO: add opportunity
        // disabled={loading}
        disabled={true}
        style={[{ marginBottom: 12 }]}
      >
        Mostrar frase secreta
      </GoToButton>
      <CustomText
        color={'greySecondary'}
        size={12}
        style={[{ marginBottom: 36, paddingHorizontal: 12 }]}
      >
        Si pierde acceso a este dispositivo, sus fondos se perderán si no hace una copia de seguridad!
      </CustomText>

      <CustomText
        color={'greySecondary'}
        size={12}
        style={[{ marginBottom: 12, paddingHorizontal: 12 }]}
      >
        Llaves de cuenta abiertas
      </CustomText>
      <GoToButton
        disabled={loading}
        style={{ marginBottom: 42 }}
        onPress={showPublicKey}
      >
        Exportar claves abiertas
      </GoToButton>

      <CustomText
        color={'greySecondary'}
        size={12}
        style={[{ marginBottom: 12, paddingHorizontal: 12 }]}
      >
        Llaves de cuenta abiertas
      </CustomText>
      <GoToButton
        disabled={loading}
        style={{ marginBottom: 42 }}
        onPress={showPrivateKey}
      >
        Exportar clave privada
      </GoToButton>

      <CustomButton
        loading={loading}
        style={{ backgroundColor: danger07, height: 42 }}
        textSize={14}
        Icon={<AntDesign name="delete" size={18} color="white" />}
        iconPosition={'right'}
        onPress={showDeleteModal}
      >
        Eliminar la billetera
      </CustomButton>
    </View>
  );
}

export function SettingsWalletItemScreen({ navigation, route }) {
  const { walletAddress } = route.params;

  return (
    <SettingsWalletItem walletAddress={walletAddress} navigation={navigation} insideBottomSheet={false} />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 18,
    flex: 1,
    backgroundColor: dark,
  },
  nameInput: {
    marginBottom: 36,
  },
});
