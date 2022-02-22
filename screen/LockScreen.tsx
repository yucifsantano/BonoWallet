import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SafeAreaView, View, Image, StyleSheet, Platform } from 'react-native';

import { CustomText } from '../component/CustomText';
import { unlockAppAction } from '../store/app/actions';
import { StatusBarHeight, deviceSize } from '../sdk/helper';
import { active, dark } from '../styles/color.theme';
import AreYouAgreeImage from '../assets/areYouAgreeImage.png';

const { width, height } = deviceSize;
const timeToLock = 60 * 1000;

export function LockScreen({ navigation }) {
  const [timeDiff, setTimeDiff] = useState({
    minutes: 0,
    seconds: 0,
  });
  const timeLocked = useSelector(state => state.app.timeLocked);
  const dispatch = useDispatch();

  useEffect(() => {
    calculateTimeLeft();
    const timer = setInterval(async () => {
      await calculateTimeLeft(timer);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const calculateTimeLeft = async (timer) => {
    const tl = new Date(timeLocked ? timeLocked : "").getTime() + timeToLock
    let timeDifferent = +new Date(tl) - +new Date();

    if (timeDifferent < 1000) {
      clearInterval(timer);
      await dispatch(unlockAppAction());
      return;
    }

    timeDifferent = Math.max(0, timeDifferent);
    const minutes = Math.floor(timeDifferent / 1000 / 60);
    const seconds = Math.floor(timeDifferent / 1000) % 60;

    setTimeDiff({
      minutes: minutes < 10 ? "0" + minutes : minutes,
      seconds: seconds < 10 ? "0" + seconds : seconds,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.description}>
        <CustomText
          align={'center'}
          size={24}
          style={{ padding: 24 }}
        >
          Número máximo de intentos excedidos.
        </CustomText>
      </View>
      <View style={styles.timerContainer}>
        <CustomText
          align={'center'}
          size={18}
        >
          La aplicación será desbloqueada a través de
        </CustomText>
        <View style={styles.timeRow}>
          <CustomText
            type={'bold'}
            color={'active'}
            size={32}
          >
            {`${timeDiff.minutes} : `}
          </CustomText>
          <CustomText
            type={'bold'}
            color={'active'}
            size={32}
          >
            {timeDiff.seconds}
          </CustomText>
        </View>
      </View>
      <View style={styles.imageContainer}>
        <Image
          source={AreYouAgreeImage}
          style={styles.imageStyle}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBarHeight : 0,
    alignItems: "center",
    justifyContent: "space-around",
  },
  description: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  timerContainer: {
    backgroundColor: dark,
    paddingHorizontal: 18,
    paddingVertical: 24,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: active,
  },
  timeRow: {
    flexDirection: "row",
    marginTop: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    width: width,
  },
  imageStyle: {
    width: width,
    height: height * 0.6,
    resizeMode: "contain",
  },
});
