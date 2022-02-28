import React, { useCallback } from 'react';
import { View, Modal, Pressable, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import { CustomText } from './CustomText';
import { CustomButton } from './CustomButton';
import { CloseIcon } from './Icons';
import { deviceSize } from '../sdk/helper';
import { dark, textDisable } from '../styles/color.theme';
import SuccessImage from '../assets/successImage.png';
import Types from '../store/modal/types';

const { height } = deviceSize;

export const CustomModal = ({ navigation }) => {
  const type = useSelector(state => state.modal.type);
  const text = useSelector(state => state.modal.text);
  const closeOnOverlay = useSelector(state => state.modal.closeOnOverlay);
  const isFullScreen = useSelector(state => state.modal.isFullScreen);
  const onClose = useSelector(state => state.modal.onClose);
  const onCloseText = useSelector(state => state.modal.onCloseText);
  const onClick = useSelector(state => state.modal.onClick);
  const onClickLoading = useSelector(state => state.modal.onClickLoading);
  const onClickText = useSelector(state => state.modal.onClickText);
  const onClickBgColor = useSelector(state => state.modal.onClickBgColor);
  const dispatch = useDispatch();

  const handlePressOverlay = () => {
    if (!isFullScreen) {
      navigation.popToTop();
      dispatch({ type: Types.TOGGLE_MODAL });
    }

    if (onClose && typeof onClose === "function") {
      onClose();
    }
  };

  const handleClick = () => {
    onClick();
    dispatch({ type: Types.TOGGLE_MODAL });
  };

  const getColor = useCallback(() => {
    switch (type) {
      case "error":
        return "danger";
      case "success":
      case "info":
      default:
        return "greySecondary";
    }
  }, [type]);

  const HEIGHT_OF_MODAL_CONTAINER = isFullScreen ? height : height * 0.5;

  return (
    <Modal
      animationType={"fade"}
      transparent={true}
      onRequestClose={handlePressOverlay}
    >
      <Pressable
        style={styles.modalOverlay}
        onPress={closeOnOverlay ? handlePressOverlay : null}
      />
      <View style={[styles.modalWrapper, { margin: isFullScreen ? 0 : 18, }]}>
        <View style={[
          styles.modalContainer,
          {
            height: HEIGHT_OF_MODAL_CONTAINER,
            backgroundColor: isFullScreen ? dark : "white",
          }
          ]}
        >
          {
            !isFullScreen && (
              <TouchableOpacity
                style={styles.modalClose}
                onPress={handlePressOverlay}
              >
                <CloseIcon />
              </TouchableOpacity>
            )
          }

          <Image
            source={SuccessImage}
            style={[styles.modalImage, {
              height: HEIGHT_OF_MODAL_CONTAINER * 0.75,
              top: isFullScreen ? 0 : (-HEIGHT_OF_MODAL_CONTAINER * 0.75) * 0.1,
              position: isFullScreen ? "relative" : "absolute",
            }]}
          />
          <View style={[styles.modalContent, { justifyContent: isFullScreen ? "flex-start" : "flex-end" }]}>
            <CustomText
              size={12}
              color={getColor()}
              style={styles.modalText}
              align={'center'}
            >
              {text}
            </CustomText>
            <View style={styles.btnWrapper}>
              <CustomButton onPress={handlePressOverlay}>
                {onCloseText}
              </CustomButton>
              {
                !!onClick && (
                  <CustomButton
                    loading={onClickLoading}
                    style={{ backgroundColor: onClickBgColor, marginLeft: 18 }}
                    onPress={handleClick}
                  >
                    {onClickText}
                  </CustomButton>
                )
              }
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalWrapper: {
    flex: 1,
    justifyContent: "center",
  },
  modalContainer: {
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingBottom: 24,
    width: "100%",
  },
  modalImage: {
    width: "100%",
    resizeMode: "contain",
  },
  modalContent: {
    flex: 1,
  },
  modalText: {
    marginBottom: 18,
  },
  modalClose: {
    width: 33,
    height: 33,
    borderRadius: 25,
    right: 12,
    top: 12,
    backgroundColor: "#efefef",
    position: "absolute",
    zIndex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  btnWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
