import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { CustomText } from '../CustomText';
import { Circle } from '../CircleBtn';
import { greyPrimary } from '../../styles/color.theme';
import { DEFAULT_RESOURCES } from '../../styles/constants';

export function TransactionItem({ item, address, onPress }) {
  const isTransactionOut = () => {
    return item.ownerAddress === address;
  };

  const handlePress = () => {
    onPress(item);
  };

  return (
    <TouchableOpacity
      style={[styles.transactionItem, item.sum ? styles.transactionItemPaddingLarge : styles.transactionItemPaddingSmall]}
      onPress={handlePress}
    >
      {
        item.hasOwnProperty("body")
        && item.body.hasOwnProperty("putInfo")
        && item.body.putInfo.hasOwnProperty("putLogo") ? (
          <Circle
            size={45}
            contentSize={33}
            lable={null}
            withShadow={true}
            imageSource={{ uri: item.body.putInfo.putLogo }}
          />
        ) : (
          <Circle
            size={45}
            contentSize={33}
            label={null}
            svgUri={DEFAULT_RESOURCES.graphCoinSvgUri}
            withShadow={true}
          />
        )
      }

      <View style={styles.transactionItemInfo}>
        <CustomText
          size={item.sum ? 14 : 12}
          numberOfLines={1}
        >
          {
            item.hasOwnProperty("body")
            && item.body.hasOwnProperty("putInfo")
            && item.body.putInfo.hasOwnProperty("putName") ? (
              item.body.putInfo.putName
            ) : "Token desconocido"
          }
        </CustomText>
        {
          item.confirmations > 0 && (
            <CustomText
              size={12}
              numberOfLines={1}
              color={"greyPrimary"}
            >
              {item.confirmed ? "Confirmado" : "No confirmado"}
            </CustomText>
          )
        }
      </View>
      {
        item.hasOwnProperty("body")
        && item.body.hasOwnProperty("amount") && (
          <View style={styles.transactionItemAmount}>
            <CustomText
              size={16}
              type={'bold'}
              color={isTransactionOut() ? "danger" : "success"}
              numberOfLines={1}
            >
              {`${isTransactionOut() ? "-" : ""}${item.body.amount}`}
            </CustomText>
            {
              item.hasOwnProperty("body")
              && item.body.hasOwnProperty("putInfo")
              && item.body.putInfo.hasOwnProperty("putSymbol")
              && (
                <CustomText
                  size={16}
                  type={'bold'}
                >
                    &nbsp;{item.body.putInfo.putSymbol}
                </CustomText>
              )
            }
          </View>
        )
      }
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  transactionItem: {
    paddingHorizontal: 30,
    flexDirection: "row",
    flex: 1,
  },
  transactionItemPaddingLarge: {
    paddingVertical: 24,
  },
  transactionItemPaddingSmall: {
    paddingVertical: 12,
  },
  transactionItemInfo: {
    justifyContent: "center",
    paddingHorizontal: 22,
    flex: 1,
  },
  transactionItemAmount: {
    flexDirection: "row",
    alignItems: "center",
  },
});
