import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NavigationServices from 'routes/NavigationServices';
import screenName from 'configs/screenName';
import FlashMessage from 'library/FlashMessage';
import { showMessage } from 'react-native-flash-message';
import HeaderDefault from 'components/HeaderDefault';
import ButtonBase from 'components/ButtonBase';
import InputAuthen from 'components/LoginComponent/InputAuthen';
import R from 'res/R';
import Container from 'library/Container';
import { requestLogin } from 'configs/apis/requestAuthen';
import status from 'configs/constants';
import utils from 'configs/utils';
import { connect } from 'react-redux';
import { showLoading, hideLoading } from 'library/Loading/LoadingComponent';
import { login } from 'middlewares/actions/login/actionLogin';
import firebase from 'react-native-firebase';
class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      item: this.props.navigation.getParam('item', {})
    };
    this.nextScreen = this.props.navigation.getParam('nextScreen')
  }
  onLogin = async () => {
    let email = this.inputEmail.getValue()
    let password = this.inputPass.getValue()
    let res = await requestLogin(email, password)
    if (res && res.code == status.SUCCESS) {
      utils.setItem(utils.KEY.TOKEN, res.token)
      utils.database.token = res.token
      this.props.dispatch(login(res.data, res.count))
      utils.alertSuccess('Đăng nhập thành công')
      if (this.nextScreen) {
        NavigationServices.navigate(this.nextScreen, {
          item: this.state.item
        })
      } else {
        NavigationServices.navigate(screenName.HomeScreen)
      }
    } else {
      utils.alertDanger(res.message)
    }
  }
  componentDidMount = () => {
    firebase.messaging().getToken()
      .then((token) => {
        console.log('Device FCM Token: ', token);
        utils.database.tokenFCM = token;
        firebase.messaging().subscribeToTopic("honghac_test");
      });
  };

  onRegister = () => {
    let item = this.props.navigation.getParam('item', {})
    let status = this.props.navigation.getParam('type', {})
    console.log('item: ', item);
    NavigationServices.navigate(screenName.InputPhoneScreen, {
      item,
      status
    })
  }
  onForgotPass = () => {
    console.log(1111)
    NavigationServices.navigate(screenName.InputPhoneScreen, {
      type: utils.database.forgotPass
    })
  }
  render() {
    return (
      <Container scrollView={true} isLoading={this.state.isLoading}>
        <View style={styles.container}>
          <InputAuthen
            label="Số điện thoại"
            placeholder="Vd: 0987654321"
            ref={ref => this.inputEmail = ref}
            keyboardType="numeric"
            maxLength={10} />
          <InputAuthen
            label="Mật khẩu"
            placeholder="********"
            ref={ref => this.inputPass = ref}
            secureTextEntry={true} />
          <ButtonBase
            onPress={this.onLogin}
            styleButton={styles.buttonLogin}
            value="ĐĂNG NHẬP " />
          <ButtonBase
            onPress={this.onRegister}
            styleButton={{
              backgroundColor: R.colors.blue,
            }}
            styleText={{ color: R.colors.white }}
            value="ĐĂNG KÝ " />
          <Text onPress={this.onForgotPass} style={styles.txtForgotPass}>Quên mật khẩu?</Text>
        </View>
      </Container>
    );
  }
}

export default connect()(LoginScreen);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10
  },
  txtForgotPass: {
    textDecorationLine: 'underline',
    textAlign: 'center',
    fontFamily: R.fonts.LightItalic,
    paddingVertical: 10
  },
  buttonLogin: {
    backgroundColor: R.colors.secondColor,
    marginTop: 20,
  },
})