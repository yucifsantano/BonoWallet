import { Platform } from 'react-native';
import { deviceSize, StatusBarHeight } from '../sdk/helper';

const { height, width } = deviceSize;

export const WALLETS_ICON_BOX_HEIGHT = 54;
export const WALLETS_ICON_BOX_MARGIN_TOP = Platform.OS === "android" ? 0 : 24;
export const PAGINATION_HEIGHT = 42;
export const ACTIONS_BOX_HEIGHT = 95;
export const CARD_WIDTH = width * 0.912;
export const CARD_HEIGHT = CARD_WIDTH * 0.65;

// wallet
export const WIDTH_OF_QR_FRAME_WITH_SHADOW = CARD_WIDTH * 0.357; // with shadow
export const HEIGHT_OF_QR_FRAME_WITH_SHADOW = CARD_WIDTH * 0.357; // with shadow
export const WIDTH_OF_QR = CARD_WIDTH * 0.33 * 0.64; // 0.33 => without shadow
export const HEIGHT_OF_QR = CARD_WIDTH * 0.33 * 0.64; // 0.33 => without shadow
export const TOP_OFFSET_OF_QR = CARD_WIDTH * 0.33 * 0.185; // 0.33 => without shadow
export const LEFT_OFFSET_OF_QR = CARD_WIDTH * 0.33 * 0.185; // 0.33 => without shadow
export const WIDTH_OF_ADDRESS_FRAME = CARD_WIDTH * 0.88;
export const HEIGHT_OF_ADDRESS_FRAME = CARD_HEIGHT * 0.26;
export const HEIGHT_OF_BALANCE_CONTENT = CARD_HEIGHT + ACTIONS_BOX_HEIGHT + WALLETS_ICON_BOX_HEIGHT;
export const HEIGHT_OF_CARD_CONTENT = CARD_HEIGHT + ACTIONS_BOX_HEIGHT + (StatusBarHeight * 2);
export const HEIGHT_OF_PROGRESSBAR = 8;
export const WIDTH_OF_PROGRESSBAR = width * 0.8;

// settings
export const PROFILE_VERTICAL_MARGIN = 30;
export const PROFILE_TEXT_INPUT_HEIGHT = 27;
export const HEIGHT_OF_PROFILE_BOX = PROFILE_TEXT_INPUT_HEIGHT * 2;

export const PADDING_TOP_FROM_NAVIGATION_HEADER = 24;

export const GLOB_VAR = {
  // wallet
  INITIAL_SNAP_POINT: height - HEIGHT_OF_BALANCE_CONTENT - PAGINATION_HEIGHT,
  SECOND_SNAP_POINT_BALANCE: height - WALLETS_ICON_BOX_HEIGHT,
  SECOND_SNAP_POINT_CARD: height - StatusBarHeight,
  PAGINATION_TOP_POSITION: HEIGHT_OF_BALANCE_CONTENT + (Platform.OS === "android" ? StatusBarHeight : 0),

  // settings
  INITIAL_SETTINGS_SNAP_POINT: height - (Platform.OS === "android" ? StatusBarHeight : 0) - HEIGHT_OF_PROFILE_BOX - (PROFILE_VERTICAL_MARGIN * 2),
  SECOND_SNAP_POINT_SETTINGS: height - StatusBarHeight,
};
