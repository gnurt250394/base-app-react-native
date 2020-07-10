import allReducer from 'middlewares/reducers';
import {applyMiddleware, createStore, compose} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {createLogger} from 'redux-logger';
import {persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
const persistConfig = {
  key: 'persistKey',
  // keyPrefix: 'x', // the redux-persist default `persist:` doesn't work with some file systems
  storage: AsyncStorage,
};

const loggerMiddleware = createLogger();
const logger = store => next => action => {
  let result = next(action);
  return result;
};
const store = createStore(
  persistReducer(persistConfig, allReducer),
  {},
  compose(applyMiddleware(thunkMiddleware, loggerMiddleware, logger)),
);

export default store;
