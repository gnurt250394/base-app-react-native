
import React, { Component } from 'react';

import {
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  Alert
} from 'react-native';

import Form from 'react-native-form';
import CountryPicker from 'react-native-country-picker-modal';
import R from 'res/R';
import apis from 'configs/apis';
import NavigationServices from 'routes/NavigationServices';
import screenName from 'configs/screenName';
import utils from 'configs/utils';
import firebase from 'react-native-firebase';
import { showLoading, hideLoading } from 'library/Loading/LoadingComponent';
import CustomOtp from './CustomOtp';


const MAX_LENGTH_CODE = 6;
const MAX_LENGTH_NUMBER = 20;

// if you want to customize the country picker
const countryPickerCustomStyles = {};

// your brand's theme primary color
const brandColor = '#744BAC';

class OtpScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      otp_code: '',
      confirmResult: null,
      phone: this.props.navigation.getParam('phone', ""),
      callingCode: this.props.navigation.getParam('callingCode', ""),
      type: this.props.navigation.getParam('type', '')
    };
  }

  _tryAgain = () => {
    NavigationServices.pop()
  }

  _renderFooter = () => {

    return (
      <View>
        <Text style={styles.wrongNumberText} onPress={this._tryAgain}>
          Nhấn vào đây nếu bạn nhập sai số điện thoại hoặc bạn cần một mã mới?
      </Text>
      </View>
    );



  }
  componentDidMount = () => {
    this.sendOtpWithFireBase()
    this.autoConfirmOtp()
  };

  // xác thực số điện thoại bằng firebase
  sendOtpWithFireBase = () => {
    let { phone, callingCode } = this.state
    console.log('phone: ', phone);
    firebase.auth().signInWithPhoneNumber('+' + callingCode + phone)
      .then(confirmResult => {
        console.log('confirmResult: ', confirmResult);
        if (confirmResult) {
          this.setState({ confirmResult })
        }

      })
      .catch(error => {
        console.log('error: ', error);
      });
  }


  // xác thực mã otp từ client gửi lên firebase
  confirmCode = (code) => () => {
    const { confirmResult, phone } = this.state;
    if (code.length == 0) {
      utils.alertWarn('Mã xác thực không được để trống')
      return
    }
    showLoading()
    if (confirmResult) {
      confirmResult.confirm(code)
        .then((user) => {
          console.log('user: ', user);
          hideLoading()
          if (user) {

            if (this.state.type == utils.database.forgotPass) {
              NavigationServices.navigate(screenName.ChangePassScreen, {
                phone
              })
            } else {
              NavigationServices.navigate(screenName.RegisterScreen, {
                phone,
                item: this.props.navigation.getParam('item', {}),
                status: this.props.navigation.getParam('status', {}),
                

              })

            }
          }
        })
        .catch(error => {
          hideLoading()
          if (error) {
            utils.alertDanger('Mã xác thực không đúng hoặc đã hết hạn')
            // nếu xác thực mã thất bại thì show thông báo
          }
        });
    }
  };

  autoConfirmOtp = () => {
    console.log('this.props.navigation.getParam(, {}): ', this.props.navigation.getParam('item', {}));
    this.unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      console.log('user: ', user);

      if (user) {
        // thành công đi nhảy vào api đăng ký tài khoản mật khẩu
        if (this.state.type == utils.database.forgotPass) {
          NavigationServices.navigate(screenName.ChangePassScreen, {
            phone: this.state.phone
          })
        } else {
          NavigationServices.navigate(screenName.RegisterScreen, {
            phone: this.state.phone,
            item: this.props.navigation.getParam('item', {}),
            status: this.props.navigation.getParam('status', {}),
            
          })

        }

      }
    });
  }



  componentWillUnmount() {
    firebase.auth().signOut()
    if (this.interval) clearInterval(this.interval);
    if (this.unsubscribe) this.unsubscribe();
  }
  render() {
    let headerText = `Mã xác minh của bạn là gì?`;
    let buttonText = 'Xác nhận';
    let textStyle = this.state.enterCode ? {
      height: 50,
      textAlign: 'center',
      fontSize: 40,
      fontWeight: 'bold',
      fontFamily: 'Courier'
    } : {};

    return (
      <View style={styles.container}>

        <Text style={styles.header}>{headerText}</Text>


        <View style={{
          alignItems: 'center',
          justifyContent: 'center'
        }}>

          <CustomOtp
            style={{ width: '80%', height: 200 }}
            pinCount={6}
            autoFocusOnLoad
            codeInputFieldStyle={styles.underlineStyleBase}
            codeInputHighlightStyle={styles.underlineStyleHighLighted}
            onCodeFilled={code => {
              this.setState({ otp_code: code })
              this.confirmCode(code)
            }}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={this.confirmCode(this.state.otp_code)}>
          <Text style={styles.buttonText}>{buttonText}</Text>
        </TouchableOpacity>

        {this._renderFooter()}




      </View>
    );
  }
}

const styles = StyleSheet.create({
  countryPicker: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    flex: 1,
    backgroundColor: R.colors.white
  },
  header: {
    textAlign: 'center',
    marginTop: 60,
    fontSize: 22,
    margin: 20,
    color: '#4A4A4A',
  },
  form: {
    margin: 20
  },
  textInput: {
    padding: 0,
    margin: 0,
    flex: 1,
    fontSize: 20,
    color: brandColor
  },
  button: {
    marginTop: 20,
    height: 50,
    backgroundColor: brandColor,
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Helvetica',
    fontSize: 16,
    fontWeight: 'bold'
  },
  wrongNumberText: {
    margin: 10,
    paddingTop: 10,
    fontSize: 14,
    textAlign: 'center',
    textDecorationLine: 'underline'
  },
  disclaimerText: {
    marginTop: 30,
    fontSize: 12,
    color: 'grey',
    textAlign: 'center'
  },
  callingCodeView: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  callingCodeText: {
    fontSize: 20,
    color: brandColor,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    paddingRight: 10
  },
  borderStyleBase: {
    width: 30,
    height: 45
  },

  borderStyleHighLighted: {
    borderColor: "#03DAC6",
  },

  underlineStyleBase: {
    width: 30,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 1,
  },

  underlineStyleHighLighted: {
    borderColor: "#03DAC6",
  },
});
export default OtpScreen;
