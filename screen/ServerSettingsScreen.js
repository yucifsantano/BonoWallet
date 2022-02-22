import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, StyleSheet } from 'react-native';

import { CustomInput } from '../component/CustomInput';
import { CustomButton } from '../component/CustomButton';
import { InfoRow } from '../component/InfoRow';
import { saveServerAction } from '../store/app/actions';
import { dark } from '../styles/color.theme';

export function ServerSettingsScreen({ navigation }) {
  const [configUrlTemp, setConfigUrlTemp] = useState("");
  const [networkTemp, setNetworkTemp] = useState("");
  const configUrl = useSelector(state => state.app.configUrl);
  const gnn = useSelector(state => state.app.gnn);
  const status = useSelector(state => state.app.status);
  const network = useSelector(state => state.app.network);
  const dispatch = useDispatch();

  useEffect(() => {
    setConfigUrlTemp(configUrl);
    setNetworkTemp(network);
  }, [configUrl, network]);

  const handleChangeConfigUrl = (value) => {
    setConfigUrlTemp(value);
  };

  const handleChangeNetwork = (value) => {
    setNetworkTemp(value);
  };

  const checkIfChanged = () => {
    return configUrlTemp === configUrl && networkTemp === network;
  };

  const handleSaveChange = () => {
    dispatch(saveServerAction({ configUrl: configUrlTemp, network: networkTemp }));
  };

  return (
    <View style={styles.container}>
      <CustomInput
        label={"Dirección URL de configuración"}
        placeholder={"config URL"}
        value={configUrlTemp}
        containerStyle={styles.inputContainer}
        onChangeText={handleChangeConfigUrl}
      />

      <CustomInput
        label={"Blockchain ID"}
        placeholder={"blockchainID"}
        value={networkTemp}
        containerStyle={styles.inputContainer}
        onChangeText={handleChangeNetwork}
      />

      <InfoRow
        label={"Número de nodos"}
        value={gnn}
        widthBorder={false}
      />
      <InfoRow
        label={"Estado del servidor"}
        value={status}
        containerStyle={styles.inputContainer}
        widthBorder={false}
      />

      <CustomButton
        disabled={checkIfChanged()}
        onPress={handleSaveChange}
      >
        Guardar
      </CustomButton>
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
  inputContainer: {
    marginBottom: 36,
  },
  readOnlyInputContainer: {
    justifyContent: "space-between"
  },
  readOnlyInput: {
    borderBottomWidth: 0,
    textAlign: "right",
    width: "60%",
  },
});
