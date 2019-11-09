import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Image, TouchableWithoutFeedback, Keyboard } from 'react-native'
import HeaderDefault from 'components/HeaderDefault'
import Container from 'library/Container'
import InputAuthen from 'components/LoginComponent/InputAuthen'
import ButtonBase from 'components/ButtonBase'
import R from 'res/R'
import { requestRegister } from 'configs/apis/requestAuthen'
import { showMessage } from 'react-native-flash-message'
import utils from 'configs/utils'
import status from 'configs/constants'
import NavigationServices from 'routes/NavigationServices'
import screenName from 'configs/screenName'
import { showLoading, hideLoading } from 'library/Loading/LoadingComponent'
import apis from 'configs/apis'
import { login } from 'middlewares/actions/login/actionLogin'
import { connect } from 'react-redux';

class RegisterScreen extends Component {
    state = {
        isLoading: false,
        hospital: '',
        gender: '',
        phone: this.props.navigation.getParam('phone', ''),
        isShow: false
    }
    onRegister = async () => {
        let fullName = this.inputFullName.getValue()
        let { hospital, gender } = this.state
        let password = this.inputPassword.getValue()
        let password2 = this.inputPassword2.getValue()
        let phone = this.inputPhone.getValue()
        let hospitalId = hospital && hospital._id ? hospital._id : null
        if (password != password2) {
            utils.alertDanger('Mật khẩu cũ và mới không khớp')
            return
        }
        let params = {
            fullName, password, hospitalId, phone, gender
        }
        // NavigationServices.navigate(screenName.OtpScreen, {
        //     params
        // })   
        let res = await requestRegister(fullName, password, hospitalId, phone, gender)
        if (res && res.code == status.SUCCESS) {
            utils.database.token = res.token
            utils.alertSuccess('Đăng ký thành công')
            let status = this.props.navigation.getParam('status', {})
            if (status == 'today') {
                NavigationServices.navigate(screenName.TestScreen, {
                    item: this.props.navigation.getParam('item', {})
                })
            } else {
                NavigationServices.navigate(screenName.GetAllSickScreen, {
                    item: this.props.navigation.getParam('item', {})
                })
            }

            this.props.dispatch(login(res.data))
            utils.setItem(utils.KEY.TOKEN, res.token)
        } else {
            utils.alertDanger(res.message)
        }

    }
    componentDidMount = () => {
        let fullName = ''
        let name = fullName.substring(fullName.lastIndexOf(" ") + 1)

        console.log('name: ', name);
    };

    selectHospital = (hospital) => {
        this.setState({ hospital })
    }
    onSelectHospital = () => {
        NavigationServices.navigate(screenName.ListHospitalScreen, {
            onItemSelected: this.selectHospital
        })
    }
    selectGender = () => {
        this.setState({ isShow: true })
    }
    hideGender = () => {
        Keyboard.dismiss()
        this.setState({ isShow: false })
    }
    setGender = (gender) => () => {
        this.hideGender()
        this.setState({ gender })
    }
    renderGender = () => {
        const { gender } = this.state
        console.log('gender: ', gender);
        if (gender == '1') {
            return "Nam"
        } else if (gender == '0') {
            return "Nữ"
        } else {
            return 'Giới tính'
        }
    }
    render() {
        const { hospital, phone, isShow, gender } = this.state
        return (
            <Container scrollView={true} isLoading={this.state.isLoading}>
                <TouchableWithoutFeedback onPress={this.hideGender}>
                    <View style={{ flex: 1 }}>
                        <InputAuthen label="Họ và tên" reqiure={true} placeholder={"Họ và Tên*"} ref={ref => this.inputFullName = ref} />
                        <View style={styles.containerPhoneGender}>
                            <InputAuthen containerStyle={{
                                width: '70%',
                            }} placeholder={"Số điện thoại*"} editable={false} value={phone} ref={ref => this.inputPhone = ref} keyboardType="numeric" />
                            <View>
                                <TouchableOpacity
                                    onPress={this.selectGender}
                                    style={[styles.buttonGender]}>
                                    <Text>{this.renderGender()}</Text>
                                    <Image source={R.images.icons.ic_up_down} style={styles.imgGender} />
                                </TouchableOpacity>
                                {isShow ?
                                    <View style={styles.containerMenuGender}>
                                        <TouchableOpacity
                                            onPress={this.setGender(1)}
                                            style={styles.buttonFale}>
                                            <Text>Nam</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={this.setGender(0)}
                                            style={styles.buttonMale}>
                                            <Text>Nữ</Text>
                                        </TouchableOpacity>
                                    </View>
                                    : null
                                }
                            </View>
                        </View>

                        <InputAuthen label="Mật khẩu" reqiure={true} placeholder={"Mật khẩu*"} ref={ref => this.inputPassword = ref} secureTextEntry={true} />
                        <InputAuthen label="Nhập lại mật khẩu" reqiure={true} placeholder={"Nhập lại mật khẩu*"} ref={ref => this.inputPassword2 = ref} secureTextEntry={true} />
                        <TouchableOpacity
                            onPress={this.onSelectHospital}
                            style={[styles.buttonGender, styles.buttonOutpatient]}>
                            <Text>{hospital && hospital.name ? hospital.name : 'Chọn bệnh viện đang điều trị ngoại trú'}</Text>
                            <Image source={R.images.icons.ic_up_down} style={styles.imgGender} />
                        </TouchableOpacity>
                        <ButtonBase value="Đăng ký " onPress={this.onRegister} styleButton={styles.buttonRegister} />
                    </View>
                </TouchableWithoutFeedback>
            </Container>
        )
    }
}

export default connect()(RegisterScreen)


const styles = StyleSheet.create({
    buttonMale: {
        height: 30,
        justifyContent: 'center',
        paddingLeft: 10
    },
    buttonFale: {
        height: 30,
        justifyContent: 'center',
        borderBottomColor: R.colors.black,
        borderBottomWidth: 1,
        paddingLeft: 10
    },
    containerMenuGender: {
        position: 'absolute',
        bottom: -30,
        backgroundColor: '#FFF',
        zIndex: 100,
        width: '100%',
        borderColor: R.colors.gray,
        borderWidth: 0.6,
        borderRadius: 5,
        elevation: 3
    },
    buttonOutpatient: {
        marginTop: 10,
        marginHorizontal: 10,
        justifyContent: 'space-between'
    },
    containerPhoneGender: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        paddingRight: 10,
        paddingTop: 5
    },
    imgGender: {
        height: 18,
        width: 18,
        resizeMode: 'contain'
    },
    buttonGender: {
        borderColor: R.colors.defaultColor,
        borderWidth: 1,
        paddingVertical: 15,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10
    },
    buttonRegister: {
        backgroundColor: R.colors.secondColor,
        marginTop: 20,
    },
})