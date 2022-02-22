import React from 'react';
import { ScrollView, View, StyleSheet, Alert } from 'react-native';
import { setString } from 'expo-clipboard';

import { Circle } from '../component/CircleBtn';
import { CustomText } from '../component/CustomText';
import { InfoRow } from '../component/InfoRow';
import { dark, danger, success, lightDark, greyPrimary, active } from '../styles/color.theme';
import { getTime } from '../sdk/helper';
import { DEFAULT_RESOURCES, TRANSACTION_STATUS } from '../styles/constants';

export function DetailsTransactionScreen({ navigation, route }) {
  const { transaction } = route.params;

  const handleCopyAddress = (value, label) => {
    setString(value);
    Alert.alert(`"${label}" El valor se copió`);
  };

  return (
    <ScrollView
      overScrollMode={"never"}
      bounces={true}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.logoBox}>
        {
          transaction.hasOwnProperty("body")
          && transaction.body.hasOwnProperty("putInfo")
          && transaction.body.putInfo.hasOwnProperty("putLogo") ? (
            <Circle
              size={60}
              contentSize={45}
              lable={null}
              withShadow={true}
              imageSource={{uri: transaction.body.putInfo.putLogo}}
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
        {
          transaction.hasOwnProperty("body")
            && transaction.body.hasOwnProperty("putInfo")
            && transaction.body.putInfo.hasOwnProperty("putName") ? (
              <CustomText style={{ marginTop: 12 }}>
                {transaction.body.putInfo.putName}
              </CustomText>
            ) : (
              <CustomText style={{ marginTop: 12 }}>
                Token desconocido
              </CustomText>
            )
        }
      </View>

      <View style={styles.infoWrapper}>
        <InfoRow
          label={"Hash"}
          value={transaction.hash}
          direction={"column"}
          widthBorder={false}
          onCopy={handleCopyAddress}
        />
      </View>
      <InfoRow
        label={"Status"}
        value={transaction.confirmed ? TRANSACTION_STATUS.CONFIRMED : TRANSACTION_STATUS.UNCONFIRMED}
        valueStyle={{ color: transaction.confirmed ? success : danger }}
        widthBorder={greyPrimary}
      />
      <InfoRow
        label={"Block"}
        value={transaction.block}
        widthBorder={greyPrimary}
      />
      <InfoRow
        label={"Time"}
        value={getTime(transaction.timestamp)}
        widthBorder={false}
      />

      <View style={styles.infoWrapper}>
        <InfoRow
          label={"From"}
          value={transaction.body.ownerAddress}
          direction={"column"}
          widthBorder={dark}
          onCopy={handleCopyAddress}
        />
        <InfoRow
          label={"To"}
          value={transaction.body.toAddress}
          direction={"column"}
          widthBorder={null}
          onCopy={handleCopyAddress}
        />
      </View>

      <InfoRow
        label={"Amount"}
        value={transaction.body.amount}
        valueStyle={{ color: active }}
        widthBorder={greyPrimary}
      />
      <InfoRow
        label={"Put ID"}
        value={transaction.body.putInfo.putId}
        widthBorder={greyPrimary}
      />
      <InfoRow
        label={"Put"}
        value={`${transaction.body.putInfo.putName} (${transaction.body.putInfo.putSymbol})`}
        widthBorder={greyPrimary}
      />
      <InfoRow
        label={"Confirmations"}
        value={transaction.confirmations}
        widthBorder={false}
      />

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: dark,
  },
  contentContainer: {
    paddingVertical: 24,
    paddingHorizontal: 18,
  },
  logoBox: {
    alignItems: "center",
    marginBottom: 24,
  },
  infoWrapper: {
    backgroundColor: lightDark,
    marginVertical: 12,
    marginHorizontal: -12,
    borderRadius: 15,
    borderColor: greyPrimary,
    borderWidth: 1,
  },
});
