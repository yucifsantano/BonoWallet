import { createReducer } from '../../sdk/helper';
import Types from './types';
import { greySecondary } from '../../styles/color.theme';

const initialStore = {
  type: "info",
  text: "",
  closeOnOverlay: false,
  isFullScreen: false,
  onClose: null,
  onCloseText: "OK",
  onClick: null,
  onClickLoading: false,
  onClickText: undefined,
  onClickBgColor: greySecondary,
};

const reducer = {
  [Types.TOGGLE_MODAL]: (draft, payload) => {
    if (!payload) {
      draft = initialStore;
      return;
    }

    draft.type = payload.type || initialStore.type;
    draft.text = payload.text || initialStore.text;
    draft.closeOnOverlay = payload.closeOnOverlay || initialStore.closeOnOverlay;
    draft.isFullScreen = payload.isFullScreen || initialStore.isFullScreen;
    draft.onClose = payload.onClose || initialStore.onClose;
    draft.onCloseText = payload.onCloseText || initialStore.onCloseText;
    draft.onClick = payload.onClick || initialStore.onClick;
    draft.onClickLoading = payload.onClickLoading || initialStore.onClickLoading;
    draft.onClickText = payload.onClickText || initialStore.onClickText;
    draft.onClickBgColor = payload.onClickBgColor || initialStore.onClickBgColor;
  },
};

export const modal = createReducer(reducer, initialStore);
