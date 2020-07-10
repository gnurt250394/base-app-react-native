import React from 'react';
import {Image, StyleSheet} from 'react-native';
import {createAppContainer} from 'react-navigation';
import screenName from 'configs/screenName';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import R from 'res/R';
import HomeScreen from 'screens/HomeScreen';
import utils from 'configs/utils';
import IconTab from 'components/IconTab';

export default createBottomTabNavigator(
  {
    [screenName.HOME]: {
      screen: HomeScreen,
      navigationOptions: {
        title: 'Trang chủ',
        tabBarIcon: ({tintColor}) => (
          <Image
            source={R.images.icons.home.ic_home}
            style={[styles.imageTab, {tintColor}]}
          />
        ),
      },
    },
    // [screenName.AccountScreen]: {
    //     screen: AccountScreen,
    //     navigationOptions: {
    //         title: 'Tài khoản',
    //         tabBarIcon: ({ tintColor }) => <Image source={R.images.icons.home.ic_account} style={[styles.imageTab, { tintColor }]} />,
    //         // tabBarOnPress: ({ navigation, defaultHandler }) => {
    //         //     if (!utils.database.token) {
    //         //         utils.alertWarn("Vui lòng đăng nhập")
    //         //         return
    //         //     }
    //         //     navigation.navigate(screenName.AccountScreen)

    //         // }
    //     }
    // },
    // [screenName.NotificationScreen]: {
    //     screen: NotificationScreen,
    //     navigationOptions: {
    //         title: 'Thông báo',
    //         tabBarIcon: ({ tintColor }) => <IconTab tintColor={tintColor} />,
    //         // tabBarOnPress: ({ navigation, defaultHandler }) => {
    //         //     if (!utils.database.token) {
    //         //         utils.alertWarn("Vui lòng đăng nhập")
    //         //         return
    //         //     }
    //         //     navigation.navigate(screenName.NotificationScreen)
    //         // }
    //     }
    // },
  },
  {
    resetOnBlur: true,
    lazy: true,
    defaultNavigationOptions: {},
    tabBarOptions: {
      activeTintColor: R.colors.black,
      activeBackgroundColor: R.colors.secondColor,
      inactiveBackgroundColor: R.colors.defaultColor,
      inactiveTintColor: R.colors.white,
      labelStyle: {
        fontWeight: 'bold',
      },
    },
  },
);

const styles = StyleSheet.create({
  imageTab: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },
});
