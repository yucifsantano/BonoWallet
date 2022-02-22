import Types from '../modal/types';
import { navigate } from '../../sdk/helper';
import { SCREEN_NAMES } from '../../styles/constants';

export const showModalAction = (data) => async (dispatch) => {
  dispatch({
    type: Types.TOGGLE_MODAL,
    payload: {
      type: data.type,
      text: data.text,
      closeOnOverlay: data.closeOnOverlay,
      isFullScreen: data.isFullScreen,
      onClose: data.onClose,
      onCloseText: data.onCloseText,
      onClick: data.onClick,
      onClickLoading: data.onClickLoading,
      onClickText: data.onClickText,
      onClickBgColor: data.onClickBgColor,
    },
  });
  navigate(SCREEN_NAMES.MODAL_SCREEN);
};
