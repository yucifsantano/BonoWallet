import React, { useMemo } from 'react';
import { compose, createStore, combineReducers, applyMiddleware } from 'redux';
import ReduxPromise from 'redux-promise';
import thunk from 'redux-thunk';
import produce from 'immer';
import { Platform, Dimensions } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { createNavigationContainerRef, StackActions } from '@react-navigation/native';
import Constants from 'expo-constants';
import { Easing } from "react-native-reanimated";

import { MONTHS_LIST } from '../styles/constants';

// redux
export const createReduxStore = _configureStore;

function _configureStore(reducers) {
  let middleware = [ReduxPromise, thunk];

  return createStore(
    combineReducers({ ...reducers }),
    undefined,
    compose(applyMiddleware(...middleware)),
  );
}

export const createReducer = (cases = {}, defaultState = {}) =>
  (state = defaultState, action) => produce(state, draft => {
    if (action && action.type && cases[action.type] instanceof Function) {
      cases[action.type](draft, action.payload);
    }
  });


// size
const { width, height } = Dimensions.get("screen");

function isIphoneWithNotch() {
  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (
      height === 780 || width === 780 ||
      height === 812 || width === 812 ||
      height === 844 || width === 844 ||
      height === 896 || width === 896 ||
      height === 926 || width === 926
    )
  );
}

export const StatusBarHeight = Platform.select({
  ios: isIphoneWithNotch() ? Constants.statusBarHeight / 2 : Constants.statusBarHeight,
  android: Constants.statusBarHeight,
  default: 0,
});

export const deviceSize = { height, width };


// styles
export const getStyle = (styles, animatedStyles, depend) => useMemo(
  () => [styles, animatedStyles],
  [depend]
);


// navigation
export const navigationRef = createNavigationContainerRef();

export function navigate({name, params}:{name:never, params?:never}) {
  if (navigationRef.isReady()) {
    navigationRef.navigate<never>(name, params);
  }
}

export function replace(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.replace(name, params));
  }
}

// storage managing
export async function saveToDeviceStorage(key, value, options?) {
  await SecureStore.setItemAsync(key, value, options);
}

export async function getValueFromDeviceStorage(key, options?) {
  return await SecureStore.getItemAsync(key, options);
}

export async function deleteValueFromDeviceStorage(key, options) {
  return await SecureStore.deleteItemAsync(key, options);
}


// ios
export function onIOSBottomSheetIndexChange({ index, scrollingSetter, listRef }) {
  if (index === 1) {
    listRef.current.getScrollResponder().scrollTo({ y: 20, animated: true });
    scrollingSetter(true);
  } else {
    scrollingSetter(false);
  }
}

export function onIOSBottomSheetListScroll({ y, scrollingSetter, bsRef }) {
  if (y <= 0) {
    scrollingSetter(false);
    bsRef.current.snapToIndex(0, {
      duration: 300,
      easing: Easing.quad,
    });
  }
}


// date helpers
function isSameDay(d1, d2) {
  return d1.getFullYear() === d2.getFullYear()
    && d1.getMonth() === d2.getMonth()
    && d1.getDate() === d2.getDate();
}

function isYesterday(d1, d2) {
  d1.setDate(d1.getDate() - 1);

  return isSameDay(d1, d2);
}

function isCurrYear(d1, d2) {
  return d1.getFullYear() === d2.getFullYear();
}

export function getTime(value, withTime = true) {
  const date = new Date(value);
  const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  return `${date.getDate()} ${MONTHS_LIST[date.getMonth()]} ${date.getFullYear()} ${withTime ? time : ""} (Local)`;
}

export function getTitleByDate(value) {
  const curr = new Date();
  const date = new Date(value);

  let title = "";
  if (isSameDay(curr, date)) {
    title = "Hoy";
  } else if (isYesterday(curr, date)) {
    title = "Ayer";
  } else if (isCurrYear(curr, date)) {
    title = `${date.getDate()} ${MONTHS_LIST[date.getMonth()]}`;
  } else {
    title = `${date.getDate()} ${MONTHS_LIST[date.getMonth()]} ${date.getFullYear()}`;
  }

  return title;
}

// transactions grouping
export function groupingTransactionsList(list) {
  const groupsObj = list.reduce((groups, current) => {
    const timestampInDateFormat = new Date(current.timestamp).toJSON();
    const dateWithoutTime = timestampInDateFormat.split('T')[0];

    groups[dateWithoutTime] = groups[dateWithoutTime] || [];
    groups[dateWithoutTime].push(current);

    return groups;
  }, {});

  return Object.keys(groupsObj).map((date) => {
    return {
      title: getTitleByDate(date),
      data: groupsObj[date],
    };
  });
}

export async function delay(ms) {
  await new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}
