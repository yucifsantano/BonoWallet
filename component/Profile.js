import React, {useEffect, useState} from 'react';
import { View, Image, TextInput, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';

import { CustomButton } from './CustomButton';
import { CloseIcon, CheckBoxIcon, SettingsIcon } from './Icons';
import DefaultAvatar from '../assets/defaultAvatar.png';
import { textWhite } from '../styles/color.theme';
import { saveProfileAction } from '../store/app/actions';
import { deviceSize, getStyle } from '../sdk/helper';
import { PROFILE_VERTICAL_MARGIN, PROFILE_TEXT_INPUT_HEIGHT, HEIGHT_OF_PROFILE_BOX } from '../styles/global';

const { width } = deviceSize;

export function Profile({ currentIndex }) {
  const [editMode, setEditMode] = useState(false);
  const name = useSelector(state => state.app.profile.name);
  const surname = useSelector(state => state.app.profile.surname);
  const [stateProfile, setStateProfile] = useState({ name: undefined, surname: undefined });
  const dispatch = useDispatch();

  useEffect(() => {
    setStateProfile({ name, surname });
  }, [name, surname]);

  const profileContainerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      currentIndex.value,
      [0, 0.7],
      [1, 0],
      Extrapolate.CLAMP,
    ),
    top: interpolate(
      currentIndex.value,
      [0, 1],
      [0, -HEIGHT_OF_PROFILE_BOX - PROFILE_VERTICAL_MARGIN * 2],
      Extrapolate.CLAMP,
    ),
  }));

  const profileContainerStyle = getStyle(styles.userContainer, profileContainerAnimatedStyle, profileContainerAnimatedStyle);

  const handleChangeMode = () => {
    setEditMode(!editMode);
  };

  const handleCancel = () => {
    setStateProfile({ name, surname });
    setEditMode(!editMode);
  };

  const handleSave = async () => {
    if ((name !== stateProfile.name) || (surname !== stateProfile.surname)) {
      await dispatch(saveProfileAction({ name: stateProfile.name, surname: stateProfile.surname }));
    }
    setEditMode(!editMode);
  };

  const handleChange = (field, value) => {
    setStateProfile({
      ...stateProfile,
      [field]: value,
    });
  };

  return (
    <Animated.View style={profileContainerStyle}>
      <View style={{ flexDirection: "row" }}>
        <Image
          source={DefaultAvatar}
          style={styles.userAvatar}
        />
        <View style={styles.userFullName}>
          <TextInput
            editable={editMode}
            value={stateProfile.name}
            style={styles.textInput}
            onChangeText={(value) => handleChange("name", value)}
          />
          <TextInput
            editable={editMode}
            value={stateProfile.surname}
            style={styles.textInput}
            onChangeText={(value) => handleChange("surname", value)}
          />
        </View>
      </View>

      <View style={styles.buttonsWrapper}>
        {
          editMode ? (
            <CustomButton
              style={styles.button}
              onlyIcon={true}
              onPress={handleSave}
              Icon={<CheckBoxIcon color={textWhite} />}
            />
          ) : (
            <CustomButton
              style={styles.button}
              onPress={handleChangeMode}
              Icon={<SettingsIcon color={textWhite} />}
            />
          )
        }
        {
          editMode && (
            <CustomButton
              style={styles.button}
              onPress={handleCancel}
              Icon={<CloseIcon color={textWhite} />}
            />
          )
        }
      </View>
    </Animated.View>
  )
}

const IMAGE_SIZE = 50;
const CONTAINER_HORIZONTAL_OFFSET = 30;
const BUTTON_SIZE = 42;

const styles = StyleSheet.create({
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: CONTAINER_HORIZONTAL_OFFSET,
    marginVertical: PROFILE_VERTICAL_MARGIN,
    height: HEIGHT_OF_PROFILE_BOX,
  },
  userAvatar: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    alignSelf: "center",
  },
  userFullName: {
    paddingLeft: 12,
    width: width - (CONTAINER_HORIZONTAL_OFFSET * 2) - IMAGE_SIZE - (BUTTON_SIZE + 12) * 2
  },
  textInput: {
    color: textWhite,
    fontWeight: "normal",
    fontFamily: "Play-Bold",
    fontSize: 24,
    lineHeight: PROFILE_TEXT_INPUT_HEIGHT,
    height: PROFILE_TEXT_INPUT_HEIGHT,
  },
  buttonsWrapper: {
    flexDirection: "row",
  },
  button: {
    minWidth: BUTTON_SIZE,
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    marginLeft: 12,
    paddingHorizontal: 0,
    paddingVertical: 0,
    alignItems: "center",
    justifyContent: "center",
  },
});
