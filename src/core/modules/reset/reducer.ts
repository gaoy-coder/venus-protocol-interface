import { LOGOUT_SUCCESS } from 'core/modules/auth/actions';
import { initialState } from 'core/modules/initialState';

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
export default function resetReducer(state: $TSFixMe, action: $TSFixMe) {
  switch (action.type) {
    case LOGOUT_SUCCESS: {
      return {
        ...state,
        ...initialState
      };
    }
    default:
      return state;
  }
}
