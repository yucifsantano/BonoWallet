import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';

import { CustomText } from './CustomText';
import { CopyIcon } from './Icons';
import { greyPrimary } from '../styles/color.theme';
import { CircleBtn } from './CircleBtn';

export function InfoRow({
  label,
  value,
  direction,
  containerStyle,
  labelStyle,
  valueStyle,
  valueComponent,
  widthBorder,
  blockWidthRatio,
  onCopy,
}) {
  return (
    <View style={[
      styles.infoRow({ borderColor: widthBorder }),
      direction === "row" ? styles.row : styles.column,
      containerStyle,
    ]}>
      <CustomText
        color={'greyPrimary'}
        style={[
          styles.labelStyle,
          {
            width: direction === "row" ? `${blockWidthRatio[0]}%` : "100%",
            paddingBottom: direction === "row" ? 0 : 12,
          },
          labelStyle,
        ]}
      >
        {`${label}:`}
      </CustomText>
      <View
        style={[
          styles.valueStyle,
          {
            width: direction === "row" ? `${blockWidthRatio[1]}%` : "100%",
            justifyContent: direction === "row" ? "flex-end" : "center",
            paddingBottom: direction === "row" ? 0 : 12,
          }
        ]}
      >
        {
          valueComponent ? (
            valueComponent
          ) : (
            <CustomText
              style={[
                styles.valueTextStyle,
                {
                  textAlign: direction === "row" ? "right" : "left",
                  flex: 1,
                },
                valueStyle,
              ]}
            >
              {value}
            </CustomText>
          )
        }

        {!!onCopy && (
          <CircleBtn
            label={null}
            Icon={CopyIcon}
            size={36}
            style={{ paddingHorizontal: 12 }}
            onPress={() => onCopy(value, label)}
          />
        )}
      </View>
    </View>
  );
}

InfoRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  valueComponent: PropTypes.element,
  direction: PropTypes.string,
  containerStyle: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.object), PropTypes.object]),
  labelStyle: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.object), PropTypes.object]),
  valueStyle: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.object), PropTypes.object]),
  widthBorder: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  blockWidthRatio: (props, propName) => {
    if (!Array.isArray(props.blockWidthRatio) || props.blockWidthRatio.length !== 2 || !props.blockWidthRatio.every(Number.isInteger)) {
      return new Error(`${propName} needs to be an array of two numbers`);
    }
    return null;
  },
  onCopy: PropTypes.oneOfType([PropTypes.func]),
};

InfoRow.defaultProps = {
  label: "",
  value: "",
  direction: "row",
  containerStyle: {},
  labelStyle: {},
  valueStyle: {},
  widthBorder: greyPrimary,
  blockWidthRatio: [40, 60],
  onCopy: null,
};

const styles = StyleSheet.create({
  infoRow: ({ borderColor }) => ({
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: borderColor ? borderColor : "transparent",
  }),
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  column: {
    flexDirection: "column",
  },
  labelStyle: {
    lineHeight: 16,
    paddingHorizontal: 12,
  },
  valueStyle: {
    flexDirection: "row",
    paddingHorizontal: 12,
    alignItems: "center",
  },
  valueTextStyle: {
    lineHeight: 16,
  },
});
