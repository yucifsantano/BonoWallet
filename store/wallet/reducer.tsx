import { createReducer } from '../../sdk/helper';
import Types from './types';

const initialStore = {
  loading: false,
  error: null,

  walletsLoading: false,
  walletsError: undefined,

  wallets: [],

  address: null,
  balance: 0,
  transactions: [],
  putSymbol: "BCC",

  amountValue: "",
  receiverAddress: "",
};

const reducer = {
  // generating or importing wallet (or checking balance)
  [Types.WALLET_LOAD_START]: draft => {
    draft.loading = true;
  },

  [Types.WALLET_LOAD_SUCCESS]: (draft, payload) => {
    draft.address = payload.address;
    draft.balance = payload.balance;
    draft.transactions = payload.transactions;
  },

  [Types.WALLET_LOAD_ERROR]: (draft, payload) => {
    draft.error = payload;
  },

  [Types.WALLET_LOAD_FINISH]: draft => {
    draft.loading = false;
  },

  // wallets
  [Types.WALLET_LIST_LOAD_START]: draft => {
    draft.walletsLoading = true;
  },

  [Types.WALLET_LIST_LOAD_SUCCESS]: (draft, payload) => {
    draft.wallets = payload;
  },

    [Types.WALLET_LIST_LOAD_ERROR]: (draft, payload) => {
    draft.walletsError = payload;
  },

  [Types.WALLET_LIST_LOAD_FINISH]: draft => {
    draft.walletsLoading = false;
  },

  [Types.CHANGE_AMOUNT_VALUE]: (draft, payload) => {
    if (payload[0] === "0" && payload[1] === "0") {
      draft.amountValue = payload.substring(1);
      return;
    }

    draft.amountValue = payload;
  },

  [Types.CHANGE_RECEIVE_ADDRESS]: (draft, payload) => {
    draft.receiverAddress = payload;
  },

  [Types.RESET_SEND_VALUES]: draft => {
    draft.amountValue = initialStore.amountValue;
    draft.receiverAddress = initialStore.receiverAddress;
  },
};

export const wallet = createReducer(reducer, initialStore)
