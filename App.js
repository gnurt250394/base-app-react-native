/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {StyleSheet, View, Text, AppRegistry} from 'react-native';
import {Provider} from 'react-redux';
import store from 'middlewares/stores';
import {Transitioner} from 'react-navigation-stack';
import RootView from './src/RootView';
import NavigationServices from 'routes/NavigationServices';
import AppContainer from 'routes/AppContainer';
import FlashMessage from 'react-native-flash-message';
import LoadingComponent from 'components/Loading/LoadingComponent';
import LoadingManager from 'components/Loading/LoadingManager';
import {persistStore} from 'redux-persist';
import {PersistGate} from 'redux-persist/integration/react';
import LoadingView from 'components/LoadingView';
store.__PERSISTOR = persistStore(store);

class App extends React.Component {
  componentDidMount() {
    LoadingManager.register(this.loadingRef);
  }

  componentWillUnmount() {
    LoadingManager.unregister(this.loadingRef);
  }
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={<LoadingView />} persistor={store.__PERSISTOR}>
          <RootView>
            <AppContainer
              uriPrefix="/app"
              ref={ref => NavigationServices.setTopNavigator(ref)}
            />
          </RootView>
        </PersistGate>
        <FlashMessage position="top" />
        <LoadingComponent ref={ref => (this.loadingRef = ref)} />
      </Provider>
    );
  }
}

export default App;
