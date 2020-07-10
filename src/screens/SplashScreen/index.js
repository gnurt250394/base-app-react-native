import React, {Component} from 'react';
import {
  View,
  Text,
  ScrollView,
  Animated,
  StyleSheet,
  Image,
} from 'react-native';
import utils, {height, width} from 'configs/utils';
import NavigationServices from 'routes/NavigationServices';
import screenName from 'configs/screenName';
import firebase from 'react-native-firebase';
import {connect} from 'react-redux';
import {login, logout} from 'middlewares/actions/login/actionLogin';
import apis from 'configs/apis';
import R from 'res/R';
class SplashScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.anim = new Animated.Value(0);
  }
  componentDidMount = async () => {
    firebase
      .messaging()
      .getToken()
      .then(res => {
        utils.database.tokenFCM = res;
      });
    setTimeout(() => {
      NavigationServices.navigate(screenName.LOGIN);
    }, 3000);
    this.animation();
  };
  getData = async () => {};
  animation = () => {
    Animated.spring(this.anim, {
      toValue: 1,
      delay: 300,
      speed: 0,
    }).start();
  };
  render() {
    const scale = this.anim.interpolate({
      inputRange: [0, 0.2, 0.5, 0.8, 1],
      outputRange: [0, 0.2, 0.5, 0.8, 1],
    });
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Animated.Text
          style={{
            fontSize: 20,
            transform: [{scale}],
          }}>
          This is splash
        </Animated.Text>
      </View>
    );
  }
}
const mapStateToProps = state => ({
  userApp: state.loginReducer.userApp,
});

export default connect(mapStateToProps)(SplashScreen);
