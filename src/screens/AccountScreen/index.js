import React, { Component } from 'react'
import { Text, View, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native'
import Container from 'library/Container'
import NavigationServices from 'routes/NavigationServices'
import screenName from 'configs/screenName'
import utils, { width } from 'configs/utils'
import { connect } from 'react-redux';
import { logout } from 'middlewares/actions/login/actionLogin'
import R from 'res/R'
import LinearGradient from 'react-native-linear-gradient';
import LoginRequire from './LoginRequire'
import DeviceInfo from 'react-native-device-info';

class AccountScreen extends Component {
    state = {
        data: [
            {
                id: 1,
                image: R.images.icons.profile.ic_profile,
                name: 'Thông tin cá nhân',
                onPress: () => {
                    NavigationServices.navigate(screenName.ProfileScreen)
                }
            },
            {
                id: 2,
                image: R.images.icons.profile.ic_pass,
                name: 'Đổi mật khẩu',
                onPress: () => {
                    NavigationServices.navigate(screenName.ChangePassScreen)
                }
            },
            {
                id: 3,
                image: R.images.icons.profile.ic_logout,
                name: 'Đăng xuất',
                onPress: () => {
                    this.props.dispatch(logout())
                    NavigationServices.navigate(screenName.AuthenStack)
                    utils.logout()
                }
            },
        ],
        ver1: '',
        ver2: ''

    }
    componentDidMount = async () => {
        let ver1 = await DeviceInfo.getVersion()
        let ver2 = await DeviceInfo.getBuildNumber()
        this.setState({ ver1, ver2 })
    };

    checkUpdate = () => {
        utils.alertSuccess('Ứng dụng đang được cập nhật');
        utils.checkupDate();
    }
    render() {
        console.log(' DeviceInfo.getVersion(): ', DeviceInfo.getVersion());
        const { userApp } = this.props
        const source = userApp.image ? { uri: userApp.image } : R.images.icons.ic_user
        if (!utils.database.token) {
            return <LoginRequire />
        }
        return (
            <ScrollView>
                <View style={{
                    flex: 1,
                }}>
                    <View style={{
                        alignItems: 'center',
                        width: '100%'
                    }}>
                        <LinearGradient colors={['#29a3a3', '#33cccc', '#5cd6d6']} style={{
                            height: 200,
                            width: width,
                        }}>
                            <View style={{
                                alignSelf: 'center',
                                alignItems: 'center',
                                paddingTop: 20,
                            }}>
                                <Image source={source} style={{
                                    height: 80,
                                    width: 80,
                                    borderRadius: 40,
                                }} />
                                <Text style={{
                                    fontFamily: R.fonts.Bold,
                                    paddingTop: 10
                                }}>{userApp.fullName}</Text>
                            </View>

                        </LinearGradient>

                    </View>
                    {this.state.data.map((e, i) => {
                        return (
                            <TouchableOpacity
                                key={i}
                                onPress={e.onPress}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    paddingVertical: 15,
                                    paddingHorizontal: 10,
                                    borderBottomColor: R.colors.black,
                                    borderBottomWidth: 1,
                                }}
                            >
                                <Image source={e.image} style={{
                                    height: 20,
                                    width: 20,
                                    resizeMode: 'contain'
                                }} />
                                <Text style={{
                                    paddingLeft: 10,
                                    fontFamily: R.fonts.Bold
                                }}>{e.name}</Text>
                            </TouchableOpacity>
                        )
                    })}

                    <TouchableOpacity style={[styles.buttonUpfate]} onPress={this.checkUpdate}>
                        <Text style={[styles.txtUpdate]}>{'Phiên bản ' + this.state.ver1 + '.' + this.state.ver2}</Text>

                    </TouchableOpacity>
                </View>
            </ScrollView>
        )
    }
}
const mapStateToProps = (state) => ({
    userApp: state.loginReducer.userApp || {}
});

const styles = StyleSheet.create({
    txtUpdate: {
        color: '#000',
        fontFamily: R.fonts.SemiboldItalic
    },
    buttonUpfate: {
        borderBottomWidth: 0,
        paddingHorizontal: 10,
        paddingTop: '15%',
        alignSelf: 'center'
    },

});
export default connect(mapStateToProps)(AccountScreen)
