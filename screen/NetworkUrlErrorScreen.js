import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, Image, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { CustomText } from '../component/CustomText';
import { CustomButton } from '../component/CustomButton';
import { GoToButton } from '../component/GoToButton';
import { StatusBarHeight } from '../sdk/helper';
import {dark, textWhite} from '../styles/color.theme';
import { checkGraphNetwork } from '../store/app/actions';
import AreYouAgreeImage from '../assets/areYouAgreeImage.png';
import { deviceSize } from '../sdk/helper';
import { SCREEN_NAMES } from '../styles/constants';

const { height, width } = deviceSize;

export function NetworkUrlErrorScreen({ navigation }) {
  const configUrl = useSelector(state => state.app.configUrl);
  const dispatch = useDispatch();

  const handleReload = () => {
    dispatch(checkGraphNetwork());
  };

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <CustomText size={16}>
        Servidor&nbsp;
        </CustomText>
        <CustomText
          size={16}
          type={'bold'}
          color={'active'}
        >
          {`"${configUrl}"`}
        </CustomText>
        <CustomText size={16}>
          &nbsp;no disponible
        </CustomText>
      </View>

      <View style={styles.imageContainer}>
        <Image
          source={AreYouAgreeImage}
          style={styles.imageStyle}
        />
      </View>

      <CustomButton
        textSize={14}
        style={styles.button}
        onPress={handleReload}
      >
        Reiniciar
      </CustomButton>
      <GoToButton
        to={SCREEN_NAMES.SERVER_SETTINGS_SCREEN}
        Icon={(<Ionicons
          name="git-network-outline"
          size={24}
          color={textWhite}
        />)}
        textSize={14}
        style={styles.button}
      >
        Configure su servidor
      </GoToButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: dark,
    paddingHorizontal: 18,
    paddingTop: Platform.OS === "android" ? StatusBarHeight : 0,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 6,
  },
  imageContainer: {
    width: width - 36,
  },
  imageStyle: {
    width: "100%",
    height: height * 0.5,
    resizeMode: "contain",
  },
  button: {
    width: width - 36,
    height: 48,
    marginBottom: 18,
  },
});
