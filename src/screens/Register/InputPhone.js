
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


export default class InputPhone extends Component {

    constructor(props) {
        super(props);
        this.state = {
            enterCode: false,
            spinner: false,
            country: {
                cca2: 'VN',
                callingCode: '84'
            },
            timer: 90,
            confirmResult: null,
        };
    }
    countDownTimer = () => {
        this.interval = setInterval(
            () => this.setState((prevState) => {
                if (prevState.timer == 0) {
                    clearInterval(this.interval)
                } else {
                    return {
                        timer: prevState.timer - 1
                    }
                }
            }
            ),
            1000
        );
    }
    _getCode = async () => {
        try {
            const { phoneNumber } = this.form.getValues()
            if (phoneNumber.length == 0) {
                utils.alertWarn('Số điện thoại không được bỏ trống')
                return
            }
            const checkPhone = utils.regexPhone(phoneNumber)
            if (!checkPhone.validated) {
                utils.alertDanger(checkPhone.message)
                return
            }
            const res = await apis.post(apis.PATH.CHECK_PHONE, {
                phone: phoneNumber,

            });

            if (res && res.code == 200) {
                // this.setState({
                //     enterCode: true,
                // });
                // this.sendOtpWithFireBase()
                // this.autoConfirmOtp()
                // this.form.refs.textInput.setNativeProps({ text: '' });
                NavigationServices.navigate(screenName.OtpScreen, {
                    phone: this.form.getValues().phoneNumber,
                    callingCode: '+' + this.state.country.callingCode
                })
            } else {
                utils.alertDanger(res.message)
            }
        } catch (err) {
            // <https://github.com/niftylettuce/react-native-loading-spinner-overlay/issues/30#issuecomment-276845098>
            setTimeout(() => {
                Alert.alert('Oops!', err.message);
            }, 100);
        }


    }




    _onChangeText = (val) => {

        if (!this.state.enterCode) return;
        if (val.length === MAX_LENGTH_CODE)
            this.confirmCode();
    }

    _tryAgain = () => {
        this.form.refs.textInput.setNativeProps({ text: '' })
        this.form.refs.textInput.focus();
        this.setState({ enterCode: false });
    }

    _getSubmitAction = () => {
        this.state.enterCode ? this.confirmCode() : this._getCode();
    }

    _changeCountry = (country) => {

        this.setState({ country });
        this.form.refs.textInput.focus();
    }

    _renderFooter = () => {

        if (this.state.enterCode)
            return (
                <View>
                    <Text style={styles.wrongNumberText} onPress={this._tryAgain}>
                        Enter the wrong number or need a new code?
          </Text>
                </View>
            );

        return (
            <View>
                <Text style={styles.disclaimerText}>By tapping "Send confirmation code" above, we will send you an SMS to confirm your phone number. Message &amp; data rates may apply.</Text>
            </View>
        );

    }

    _renderCountryPicker = () => {

        if (this.state.enterCode)
            return (
                <View />
            );

        return (
            <CountryPicker
                ref={'countryPicker'}
                countryCode={this.state.country.cca2}
                onSelect={this._changeCountry}
                translation='eng' />
        );

    }

    _renderCallingCode = () => {

        if (this.state.enterCode)
            return (
                <View />
            );

        return (
            <View style={styles.callingCodeView}>
                <Text style={styles.callingCodeText}>+{this.state.country.callingCode}</Text>
            </View>
        );

    }

    render() {

        let headerText = `What's your ${this.state.enterCode ? 'verification code' : 'phone number'}?`
        let buttonText = this.state.enterCode ? 'Verify confirmation code' : 'Send confirmation code';
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

                <Form ref={ref => this.form = ref} style={styles.form}>

                    <View style={{ flexDirection: 'row' }}>

                        {this._renderCountryPicker()}
                        {this._renderCallingCode()}

                        <TextInput
                            ref={'textInput'}
                            name={this.state.enterCode ? 'code' : 'phoneNumber'}
                            type={'TextInput'}
                            underlineColorAndroid={'transparent'}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            onChangeText={this._onChangeText}
                            placeholder={this.state.enterCode ? '_ _ _ _ _ _' : 'Phone Number'}
                            keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
                            style={[styles.textInput, textStyle]}
                            returnKeyType='go'
                            autoFocus
                            placeholderTextColor={brandColor}
                            selectionColor={brandColor}
                            maxLength={this.state.enterCode ? 6 : 10}
                            onSubmitEditing={this._getSubmitAction} />


                    </View>

                    <TouchableOpacity style={styles.button} onPress={this._getSubmitAction}>
                        <Text style={styles.buttonText}>{buttonText}</Text>
                    </TouchableOpacity>

                    {this._renderFooter()}

                </Form>



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
        fontSize: 14,
        textAlign: 'center'
    },
    disclaimerText: {
        marginTop: 30,
        fontSize: 12,
        color: 'grey'
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