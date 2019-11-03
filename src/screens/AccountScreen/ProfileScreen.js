import React, { Component } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Keyboard } from 'react-native';
import Container from 'library/Container';
import R from 'res/R';
import { connect } from 'react-redux';
import NavigationServices from 'routes/NavigationServices';
import screenName from 'configs/screenName';
import apis from 'configs/apis';
import { login } from 'middlewares/actions/login/actionLogin';
import { uploadImage } from 'configs/apis/UploadImage';

class ProfileScreen extends Component {
    constructor(props) {
        super(props);
        let user = this.props.userApp || {}

        this.state = {
            gender: user.gender,
            isShow: false,
            hospital: user.hospital || {},
            images: user.image,
            city: user.citys || {},
            district: user.district || {},
            communes: user.commune || {},
            fullName: user.fullName,
        };
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
        console.log('gender: ', gender);
        if (gender == '1') {
            return "Nam"
        } else if (gender == '0') {
            return "Nữ"
        } else {
            return 'Giới tính'
        }
    }
    selectAvatar = async () => {
        let res = await uploadImage(this.state.images)
        if (res && res.code == 200) {
            this.setState({ images: res.image })
        }
    }
    selectHospital = (hospital) => {
        this.setState({ hospital })
    }
    onSelectHospital = () => {
        NavigationServices.navigate(screenName.HospitalScreen, {
            onItemSelected: this.selectHospital
        })
    }
    selectCity = (state) => (value) => {
        this.setState({ [state]: value })
    }
    onSelectCity = (route, state, parrent_id) => () => {
        NavigationServices.navigate(route, {
            onItemSelected: this.selectCity(state),
            parrent_id
        })
    }
    onSave = async () => {
        const { city, communes, district, gender, fullName, hospital } = this.state
        let params = {
            fullName,
            hospitalId: hospital._id,
            gender,
            commune_id: communes.id_commune,
            city_id: city.id_city,
            district_id: district.id_district
        }
        let res = await apis.put(apis.PATH.USER, params)
        if (res && res.code == 200) {
            let obj = res.data
            obj.hospital = hospital
            obj.citys = city
            obj.district = district
            obj.commune = communes
            this.props.dispatch(login(obj, res.count))
            NavigationServices.pop()
        }
    }
    onChangeText = (fullName) => {
        this.setState({ fullName })
    }
    render() {
        const { isShow, gender, hospital, images, city, district, communes, fullName } = this.state
        const { userApp } = this.props
        const image = userApp && userApp.image ? { uri: userApp.image } : R.images.icons.ic_user
        const source = images ? { uri: images } : image
        return (
            <Container scrollView={true}>
                <View style={styles.containerAvatar}>
                    <TouchableOpacity
                        onPress={this.selectAvatar}
                    >
                        <Image source={source} style={styles.imgAvatar} />
                    </TouchableOpacity>
                    <Text style={styles.txtName}>{userApp.name}</Text>
                </View>
                <View style={styles.container}>
                    <TextInput
                        placeholder="Họ và tên"
                        value={fullName}
                        onChangeText={this.onChangeText}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Số điện thoại"
                        editable={false}
                        value={userApp.phone}
                        style={[styles.input, { marginTop: 10 }]}
                    />
                    <View style={styles.containerbutton}>
                        <TouchableOpacity
                            onPress={this.onSelectHospital}
                            style={[styles.buttonGender, { width: '60%' }]}>
                            <Text numberOfLines={1} style={{ width: '90%' }}>{hospital && hospital.name ? hospital.name : 'Chọn bệnh viện đang điều trị ngoại trú'}</Text>
                            <Image source={R.images.icons.ic_up_down} style={styles.imgGender} />
                        </TouchableOpacity>
                        <View style={{ width: '30%' }}>
                            <TouchableOpacity
                                onPress={this.selectGender}
                                style={[styles.buttonGender,]}>
                                <Text style={{ width: '80%' }}>{this.renderGender()}</Text>
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
                    <TouchableOpacity
                        onPress={this.onSelectCity(screenName.CityScreen, 'city')}
                        style={[styles.buttonGender, styles.buttonOutpatient]}>
                        <Text>{city && city.name ? city.name : 'Tỉnh / Thành phố'}</Text>
                        <Image source={R.images.icons.ic_next_arrow} style={styles.imgGender} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={this.onSelectCity(screenName.DistrictScreen, 'district', city.id_city)}
                        style={[styles.buttonGender, styles.buttonOutpatient]}>
                        <Text>{district && district.name ? district.name : 'Quận / Huyện'}</Text>
                        <Image source={R.images.icons.ic_next_arrow} style={styles.imgGender} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={this.onSelectCity(screenName.CommunesScreen, 'communes', district.id_district)}
                        style={[styles.buttonGender, styles.buttonOutpatient]}>
                        <Text>{communes && communes.name ? communes.name : 'Xã / Phường'}</Text>
                        <Image source={R.images.icons.ic_next_arrow} style={styles.imgGender} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    style={{
                        backgroundColor: R.colors.blue,
                        borderRadius: 10,
                        alignSelf: 'center',
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                        marginTop: 10
                    }}
                    onPress={this.onSave}
                >
                    <Text style={{ color: R.colors.white }}>Lưu</Text>
                </TouchableOpacity>

            </Container>
        );
    }
}


const styles = StyleSheet.create({
    containerbutton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 10
    },
    input: {
        borderColor: R.colors.defaultColor,
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 10
    },
    container: {
        padding: 10
    },
    txtName: {
        fontFamily: R.fonts.Black,
        paddingTop: 10
    },
    containerAvatar: {
        alignSelf: 'center',
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 20
    },
    imgAvatar: {
        height: 80,
        width: 80,
        borderRadius: 40,
    },
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
        resizeMode: 'contain',
        tintColor: R.colors.defaultColor
    },
    buttonGender: {
        borderColor: R.colors.defaultColor,
        borderWidth: 1,
        paddingVertical: 15,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,

    },
    buttonRegister: {
        backgroundColor: R.colors.secondColor,
        marginTop: 20,
    },
})
const mapStateToProps = (state) => ({
    userApp: state.loginReducer.userApp
});
const mapDispatchToProps = (dispatch) => ({

});
export default connect(mapStateToProps)(ProfileScreen);
