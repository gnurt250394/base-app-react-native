import React, { Component } from 'react';
import { View, Text, ScrollView, Animated, StyleSheet, Image } from 'react-native';
import utils, { height, width } from 'configs/utils';
import NavigationServices from 'routes/NavigationServices';
import screenName from 'configs/screenName';
import firebase from 'react-native-firebase';
import { connect } from 'react-redux';
import { login, logout } from 'middlewares/actions/login/actionLogin';
import apis from 'configs/apis';
import R from 'res/R';
class SplashScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.anim = new Animated.Value(0)
  }
  componentDidMount = async () => {
    utils.getItem(utils.KEY.KEY_HAS_UPDATE_NEW_VERSION).then(key => {
      utils.setItem(utils.KEY.KEY_HAS_UPDATE_NEW_VERSION, 0)
      if(key ==1){
        utils.alertSuccess('Ứng dụng của bạn đã được cập nhật')
      }
    })
    firebase.messaging().getToken().then(res => {
      utils.database.tokenFCM = res
    })
    let token = await utils.getItem(utils.KEY.TOKEN)
    if (token) {
      utils.database.token = token
      let res = await apis.fetch(apis.PATH.USER, {}, true)
      console.log('res: aaaa', res);
      if (res && res.code == 200) {
        this.props.dispatch(login(res.data, res.count))
        setTimeout(() => {
          this.props.navigation.navigate(screenName.HomeStack)
        }, 1000)
      } else {
        this.props.dispatch(logout())

        setTimeout(() => {
          utils.logout()
          this.props.navigation.navigate(screenName.AuthenStack)
        }, 1000)
      }

    } else {
      setTimeout(() => {
        this.props.navigation.navigate(screenName.HomeStack)
      }, 1000)
    }
    this.animation()
  };
  getData = async () => {

  }
  animation = () => {
    Animated.spring(this.anim, {
      toValue: 1,
      delay: 300,
    })
  }
  render() {
    const scale = this.anim.interpolate({
      inputRange: [0, 0.2, 0.5, 0.8, 1],
      outputRange: [0, 0.2, 0.5, 0.8, 1]
    })
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>

        <Animated.Image source={R.images.default.flamigos} style={{
          height: width / 2,
          width: width / 2,
          transform: [{ scale }]
        }} />
      </View>
    );
  }
}
const mapStateToProps = (state) => ({
  userApp: state.loginReducer.userApp
});

export default connect(mapStateToProps)(SplashScreen);
