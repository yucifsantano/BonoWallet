import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { CustomButton } from '../component/CustomButton';
import { deviceSize } from '../sdk/helper';
import { AUTO_LOCK, AUTO_LOCK_VALUE_TRANSL, SECURE_STORE_NAMES } from '../styles/constants';
import { dark, active, darkGrey } from '../styles/color.theme';
import Types from '../store/app/types';

const { width } = deviceSize;

export function AutoLockListScreen({ navigation }) {
  const autoLockValue = useSelector(state => state.app.autoLockValue);
  const dispatch = useDispatch();

  const handleChooseItem = async (value) => {
    dispatch({ type: Types.CHANGE_AUTO_LOCK_VALUE, payload: value });
    await AsyncStorage.setItem(SECURE_STORE_NAMES.AUTO_LOCK, value.toString());
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {Object.keys(AUTO_LOCK).map(key => (
          <CustomButton
            style={[styles.button]}
            key={key}
            textSize={14}
            textColor={"textWhite"}
            type={'transparent'}
            Icon={(
              <MaterialIcons
                name={autoLockValue === AUTO_LOCK[key] ? "radio-button-checked" : "radio-button-unchecked"}
                size={24}
                color={active}
              />
            )}
            iconPosition={'right'}
            onPress={() => handleChooseItem(AUTO_LOCK[key])}
          >
            {AUTO_LOCK_VALUE_TRANSL[AUTO_LOCK[key]]}
          </CustomButton>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 24,
    paddingHorizontal: 24,
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: dark,
  },
  button: {
    width: width - (24 * 2),
    marginBottom: 12,
    justifyContent: "space-between",
    borderColor: darkGrey,
    borderWidth: 2,
  }
});
