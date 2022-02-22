import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { View, TextInput, StyleSheet } from 'react-native';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';

import { CustomText } from './CustomText';
import { CustomButton } from './CustomButton';
import { active, dark, greySecondary, textWhite, danger } from '../styles/color.theme';

export const CustomInput = ({
  value,
  label,
  placeholder,
  editable,
  autoFocus,
  buttons,
  selectionColor,
  containerStyle,
  inputStyle,
  isInsideBottomSheet,
  onChangeText,
  error,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleInputFocus = () => setIsFocused(true);

  const handleInputBlur = () => setIsFocused(false);

  return (
    <View
      style={[
        styles.container,
        containerStyle,
      ]}
    >
      <CustomText
        size={12}
        color={'greySecondary'}
        style={[styles.label]}
      >
        {label}
      </CustomText>
      <View style={styles.inputWrapper}>
        {
          isInsideBottomSheet ? (
            <BottomSheetTextInput
              value={value}
              defaultValue={props.defaultValue}
              placeholder={placeholder}
              editable={editable}
              autoFocus={autoFocus}
              selectionColor={selectionColor}
              style={[styles.input, { borderBottomColor: error ? danger : (isFocused ? active : textWhite) }, inputStyle]}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              onChangeText={onChangeText}
              {...props}
            />
          ) : (
            <TextInput
              value={value}
              defaultValue={props.defaultValue}
              placeholder={placeholder}
              editable={editable}
              autoFocus={autoFocus}
              selectionColor={selectionColor}
              style={[styles.input, { borderBottomColor: error ? danger : (isFocused ? active : textWhite) }, inputStyle]}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              onChangeText={onChangeText}
              {...props}
            />
          )
        }
        {
          buttons.length > 0 && (
            <View style={[styles.btnWrapper, { borderBottomColor: error ? danger : (isFocused ? active : textWhite) } ]}>
              {
                buttons.map(({ text, ...btnProps }) => (
                  <CustomButton
                    key={text}
                    style={[styles.btnStyle]}
                    textColor={error ? "danger" : "active"}
                    {...btnProps}
                  >
                    {text}
                  </CustomButton>
                ))
              }
            </View>
          )
        }
      </View>
      {
        !!error && (
          <CustomText
            style={styles.errorStyle}
            size={12}
            color={'danger'}
          >
            {error}
          </CustomText>
        )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
  },
  label: {
    paddingHorizontal: 12,
    marginBottom: 6,
    lineHeight: 14,
  },
  inputWrapper: {
    flexDirection: "row",
  },
  input: {
    height: 42,
    flex: 1,
    borderBottomWidth: 1,
    color: textWhite,
    paddingHorizontal: 12,
    fontFamily: "Play-Regular",
    fontSize: 14,
  },
  btnWrapper: {
    flexDirection: "row",
    right: 12,
    height: 42,
    justifyContent: "center",
    backgroundColor: dark,
    borderBottomWidth: 1,
  },
  btnStyle: {
    minWidth: 36,
    paddingHorizontal: 6,
    paddingVertical: 12,
    marginLeft: 6,
    backgroundColor: "transparent",
  },
  errorStyle: {
    marginTop: 3,
    paddingHorizontal: 12,
  },
});

CustomInput.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  label: PropTypes.string,
  placeholder: PropTypes.string,
  placeholderTextColor: PropTypes.string,
  editable: PropTypes.bool,
  autoFocus: PropTypes.bool,
  buttons: PropTypes.arrayOf(PropTypes.object),
  selectionColor: PropTypes.string,
  containerStyle: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.object), PropTypes.object]),
  inputStyle: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.object), PropTypes.object]),
  isInsideBottomSheet: PropTypes.bool,
  onChangeText: PropTypes.func,
  error: PropTypes.string,
};

CustomInput.defaultProps = {
  value: "",
  label: null,
  placeholder: "",
  placeholderTextColor: greySecondary,
  editable: true,
  autoFocus: false,
  buttons: [],
  selectionColor: active,
  containerStyle: {},
  inputStyle: {},
  isInsideBottomSheet: false,
  onChangeText: () => {},
  error: "",
};
