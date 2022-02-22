import { createReducer } from '../../sdk/helper';
import Types from './types';
import { DEFAULT_RESOURCES, BIOMETRIC_METHOD, AUTO_LOCK } from '../../styles/constants';

const initialStore = {
  activeSlide: 0,

  timeLocked: null,
  secureChecking: true,
  isLocalAuthenticated: false,
  isPasscodeExist: false,
  biometricIsOn: false,
  biometricMethod: BIOMETRIC_METHOD.NONE,
  autoLockValue: AUTO_LOCK.FIVE_MINUTES,

  profile: {
    name: "Nombre",
    surname: "Apellido",
  },

  checkNetworkLoading: true,
  checkNetworkError: undefined,
  configUrl: DEFAULT_RESOURCES.graphNetworkUrl,
  gnn: "Unknown",
  status: "inactive",
  network: undefined,
};

const reducer = {
  [Types.CHANGE_ACTIVE_SLIDE]: (draft, payload) => {
    draft.activeSlide = payload;
  },

  [Types.CHANGE_PROFILE]: (draft, payload) => {
    draft.profile.name = payload.name;
    draft.profile.surname = payload.surname;
  },

  [Types.CHECK_NETWORK_START]: draft => {
    draft.checkNetworkLoading = true;
  },

  [Types.CHECK_NETWORK_SUCCESS]: (draft, payload) => {
    draft.configUrl = payload.configUrl || initialStore.configUrl;
    draft.gnn = payload.gnn || initialStore.gnn;
    draft.status = payload.status || initialStore.status;
    draft.network = payload.network || initialStore.network;
    draft.checkNetworkError = null;
  },

  [Types.CHANGE_NETWORK_CONFIG]: (draft, payload) => {
    draft.configUrl = payload.configUrl || initialStore.configUrl;
    draft.network = payload.network || initialStore.network;
  },

  [Types.CHECK_NETWORK_ERROR]: (draft, payload) => {
    draft.checkNetworkError = payload;
  },

  [Types.CHECK_NETWORK_FINISH]: draft => {
    draft.checkNetworkLoading = false;
  },

  [Types.SECURE_CHECKING_START]: draft => {
    draft.secureChecking = true;
  },

  [Types.SECURE_CHECKING_FINISH]: draft => {
    draft.secureChecking = false;
  },

  [Types.CHANGE_IS_LOCAL_AUTHENTICATED]: (draft, payload) => {
    draft.isLocalAuthenticated = payload;
  },

  [Types.CHANGE_IS_PASSCODE_EXIST]: (draft, payload) => {
    draft.isPasscodeExist = payload;
  },

  [Types.CHANGE_BIOMETRIC_IS_ON]: (draft, payload) => {
    draft.biometricIsOn = payload;
  },

  [Types.CHANGE_BIOMETRIC_METHOD]: (draft, payload) => {
    draft.biometricMethod = payload;
  },

  [Types.CHANGE_AUTO_LOCK_VALUE]: (draft, payload) => {
    draft.autoLockValue = payload;
  },

  [Types.CHANGE_APP_LOCKED_TIME]: (draft, payload) => {
    draft.timeLocked = payload;
  },
};

export const app = createReducer(reducer, initialStore);

