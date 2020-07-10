import actionTypes from 'middlewares/actions/actionTypes';
import utils from 'configs/utils';
import NavigationServices from 'routes/NavigationServices';
import screenName from 'configs/screenName';

const initialState = {
  userApp: {},
  count: 0,
};

const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOGIN:
      return {
        ...state,
        userApp: action.payload,
        count: action.count,
      };
    case actionTypes.LOGOUT:
      return {
        ...state,
        userApp: {},
        count: 0,
      };
    case actionTypes.NOTIFICATION:
      return {
        ...state,
        count: action.count,
      };
    case 'persist/REHYDRATE':
      if (action?.payload?.loginReducer) {
        return {
          ...state,
          ...action.payload.loginReducer,
        };
      }
    default:
      return state;
  }
};
export default loginReducer;
