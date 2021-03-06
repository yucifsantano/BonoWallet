export const SCREEN_NAMES =  {
  // navigators
  APP_NAVIGATOR: "APP_NAVIGATOR",
  ADD_WALLET_NAVIGATOR: "ADD_WALLET_NAVIGATOR",
  TABS_NAVIGATOR: "TABS_NAVIGATOR",
  LOCK_APP_NAVIGATOR: "LOCK_APP_NAVIGATOR",

  // screens
  APP_LOADING_SCREEN: "APP_LOADING_SCREEN",
  MODAL_SCREEN: "MODAL_SCREEN",
  QR_SCANNER_SCREEN: "QR_SCANNER_SCREEN",

  // auth
  LOCAL_AUTH_SCREEN: "LOCAL_AUTH_SCREEN",
  LOCK_APP_SCREEN: "LOCK_APP_SCREEN",
  AUTO_LOCK_LIST_SCREEN: "AUTO_LOCK_LIST_SCREEN",

  // wallet creating
  ADD_WALLET_SCREEN: "ADD_WALLET_SCREEN",
  GENERATE_WALLET_SCREEN: "GENERATE_WALLET_SCREEN",
  IMPORT_WALLET_SCREEN: "IMPORT_WALLET_SCREEN",

  // wallet
  DETAILS_SCREEN: "DETAILS_SCREEN",
  WALLET_SCREEN: "WALLET_SCREEN",
  SEND_SETUP_SCREEN: "SEND_SETUP_SCREEN",
  SEND_CONFIRM_SCREEN: "SEND_CONFIRM_SCREEN",
  RECEIVE_SCREEN: "RECEIVE_SCREEN",

  //
  EXCHANGE_SCREEN: "EXCHANGE_SCREEN",
  ANALYTICS_SCREEN: "ANALYTICS_SCREEN",

  // settings
  SETTINGS_WALLET_LIST: "SETTINGS_WALLET_LIST",
  SETTINGS_WALLET_ITEM: "SETTINGS_WALLET_ITEM",
  SETTINGS_WALLET_PUBLIC_KEY: "SETTINGS_WALLET_PUBLIC_KEY",
  SETTINGS_WALLET_PRIVATE_KEY: "SETTINGS_WALLET_PRIVATE_KEY",
  GLOBAL_SETTINGS_SCREEN: "GLOBAL_SETTINGS_SCREEN",
  SECURITY_SETTINGS_SCREEN: "SECURITY_SETTINGS_SCREEN",
  SERVER_SETTINGS_SCREEN: "SERVER_SETTINGS_SCREEN",
  NETWORK_URL_ERROR_SCREEN: "NETWORK_URL_ERROR_SCREEN",
};

export const SECURE_STORE_NAMES = {
  WALLETS: "WALLETS",
  ACTIVE_WALLET_ADDRESS: "ACTIVE_WALLET_ADDRESS",
  GRAPH_NETWORK_URL: "GRAPH_NETWORK_URL",
  PROFILE: "PROFILE",
  PASSCODE: "PASSCODE",
  BIOMETRIC_IS_ON: "BIOMETRIC_IS_ON",
  AUTO_LOCK: "AUTO_LOCK",
  TIME_APP_LOCKED: "TIME_APP_LOCKED",
  ATTEMPTS_COUNT: "ATTEMPTS_COUNT",
  EXIT_PROPS: "EXIT_PROPS",
};

export const DEFAULT_RESOURCES = {
  graphCoinSvgUri: "https://glcdn.sgp1.digitaloceanspaces.com/graph/coin.svg",
  graphCoinPngUri: "https://glcdn.sgp1.digitaloceanspaces.com/graph/coin.png",
  graphNetworkUrl: "https://core.graph.finance",
};

export const MONTHS_LIST = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export const TRANSACTION_STATUS = {
  CONFIRMED: "CONFIRMADO",
  UNCONFIRMED: "NO CONFIRMADO"
};

export const LOCAL_AUTH_SCREEN_MODE = {
  CREATE_PASSCODE: "CREATE_PASSCODE",
  REPEAT_PASSCODE: "REPEAT_PASSCODE",
  DELETE_PASSCODE: "DELETE_PASSCODE",
  CONFIRM_PASSCODE: "CONFIRM_PASSCODE",
  APP_STATE_BECOME_ACTIVE: "APP_STATE_BECOME_ACTIVE",
  AUTH_IN_APP: "AUTH_IN_APP",
};

export const BIOMETRIC_METHOD = {
  NONE: "NONE",
  FINGERPRINT: "FINGERPRINT",
  FACE_ID: "FACE_ID",
};

export const AUTO_LOCK = {
  IMMEDIATE: 0,
  ONE_MINUTE: 1000 * 60,
  TWO_MINUTES: 1000 * 60 * 2,
  FIVE_MINUTES: 1000 * 60 * 5,
  TEN_MINUTES: 1000 * 60 * 10,
  HALF_HOUR: 1000 * 60 * 30,
  ONE_HOUR: 1000 * 60 * 60,
  TWO_HOURS: 1000 * 60 * 60 * 2,
  FIVE_HOURS: 1000 * 60 * 60 * 5,
  TEN_HOURS: 1000 * 60 * 60 * 10,
};

export const AUTO_LOCK_VALUE_TRANSL = {
  [AUTO_LOCK.IMMEDIATE] :"Inmediatamente",
  [AUTO_LOCK.ONE_MINUTE] :"1 minuto",
  [AUTO_LOCK.TWO_MINUTES] :"2 minutos",
  [AUTO_LOCK.FIVE_MINUTES] :"5 minutos",
  [AUTO_LOCK.TEN_MINUTES] :"10 minutos",
  [AUTO_LOCK.HALF_HOUR] :"30 minutos",
  [AUTO_LOCK.ONE_HOUR] :"1 hora",
  [AUTO_LOCK.TWO_HOURS] :"2 horas",
  [AUTO_LOCK.FIVE_HOURS] :"5 horas",
  [AUTO_LOCK.TEN_HOURS] :"10 horas",
}
