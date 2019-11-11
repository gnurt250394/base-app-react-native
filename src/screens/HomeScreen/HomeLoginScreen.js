import React, { Component } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, FlatList, TextInput } from 'react-native';
import R from 'res/R';
import Container from 'library/Container';
import ScaleText from 'components/TextScale';
import NavigationServices from 'routes/NavigationServices';
import screenName from 'configs/screenName';
import utils, { height } from 'configs/utils';
import ActionSheet from 'react-native-actionsheet'
import PushNotification from 'components/PushNotification';
import { connect } from 'react-redux';
import apis from 'configs/apis';

class HomeLoginScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listButton: [
                {
                    id: 1,
                    onPress: () => {
                        NavigationServices.navigate(screenName.FollowHealthScreen)
                    },
                    image: R.images.icons.home.ic_ehealth,
                    name: 'Theo dõi sức khỏe'
                },
                {
                    id: 2,
                    onPress: () => {
                        NavigationServices.navigate(screenName.ScheduleScreen)
                    },
                    image: R.images.icons.home.ic_calendar,
                    name: 'Lịch khám'
                },
                {
                    id: 3,
                    onPress: () => {
                        NavigationServices.navigate(screenName.DrugScreen)

                    },
                    image: R.images.icons.home.ic_drug,
                    name: 'Đơn thuốc của bạn'

                },
                {
                    id: 4,
                    onPress: () => {
                        utils.alertWarn('Chức năng đang phát triển')
                        return
                        NavigationServices.navigate(screenName.TabDoctor)
                    },
                    image: R.images.icons.home.ic_doctor,
                    name: 'Tư vấn trực tuyến'

                },

            ],
            value: ''

        };
    }
    _renderItem = ({ item, index }) => (
        <TouchableOpacity
            onPress={item.onPress}
            style={styles.containerText}>
            <Image source={item.image} style={styles.imageButton} />
            <ScaleText fontFamily="bold" style={styles.txtNameButton}>{item.name}</ScaleText>
        </TouchableOpacity>
    )
    _keyExtractor = (item, index) => `${item.id || index}`
    onReport = () => {
        NavigationServices.navigate(screenName.ReportScreen)
    }
    onSend = async () => {
        if (!this.state.value) {
            utils.alertDanger('Vui lòng nhập chỉ số')
            return
        }
        let res = await apis.fetch(apis.PATH.CHECK_TYPE)
        if (res && res.code == 200) {
            NavigationServices.navigate(screenName.TestTodayScreen, {
                value: this.state.value
            })
        } else {
            NavigationServices.navigate(screenName.GetAllSickScreen, {
                type: 'today',
                value: this.state.value

            })
        }

    }
    onChangeText = (value) => {
        this.setState({ value })
    }
    render() {
        const { listButton } = this.state
        const { userApp } = this.props
        const question = 'Hôm nay chỉ số đường huyết của bạn là bao nhiêu?'
        // const question = 'Trả lời ngay các câu hỏi để khảo sát tình hình sức khỏe của bạn'
        return (
            <Container style={styles.flex}
                scrollView={true}
            >
                {/**view 1 */}
                <View style={styles.containerView1}>
                    <ScaleText size={20} style={styles.txtHello}>Xin chào, <ScaleText fontFamily="boldItalic" size={20} style={{
                        color: R.colors.defaultColor
                    }}>{userApp.name}</ScaleText></ScaleText>
                    <View style={styles.containerHeaderTitle}>
                        <ScaleText fontFamily="lightItalic" size={16} style={styles.TxtQuestion} >{question}</ScaleText>
                        <View style={styles.containerInput}>
                            <TextInput
                                placeholder="Nhập câu trả lời"
                                keyboardType="numeric"
                                onChangeText={this.onChangeText}
                                style={styles.input} />
                            <TouchableOpacity
                                onPress={this.onSend}
                                style={styles.buttonSend}>
                                <ScaleText fontFamily="bold" style={styles.txtSend}>Gửi</ScaleText>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={this.onReport}
                        style={styles.buttonWarning}>
                        <Image source={R.images.icons.home.ic_warning} style={styles.imageWarning} />
                        <ScaleText>Báo cáo dấu hiệu bất thường</ScaleText>
                    </TouchableOpacity>
                </View>




                {/**view 3 */}
                <View style={styles.containerView3}>

                    <FlatList
                        data={listButton}
                        numColumns={2}
                        renderItem={this._renderItem}
                        keyExtractor={this._keyExtractor}
                    />



                </View>

                <PushNotification />
            </Container>
        );
    }
}
const mapStateToProps = (state) => ({
    userApp: state.loginReducer.userApp || {}
});

export default connect(mapStateToProps)(HomeLoginScreen);


const styles = StyleSheet.create({
    imageWarning: {
        height: 18,
        width: 18,
        resizeMode: 'contain',
        marginRight: 10
    },
    buttonWarning: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 13
    },
    txtSend: {
        color: R.colors.white
    },
    buttonSend: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        // backgroundColor:R.colors.white,
        borderRadius: 5,
        // marginLeft:10
    },
    input: {
        backgroundColor: R.colors.white,
        height: 40,
        fontFamily: R.fonts.Light,
        paddingHorizontal: 10,
        width: '70%',
        borderRadius: 5
    },
    containerInput: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    TxtQuestion: {
        color: R.colors.white,
        textAlign: 'center',
        paddingBottom: 20,
        paddingHorizontal: 10,
    },
    txtNameButton: {
        paddingTop: 10,
    },
    imageButton: {
        height: 40,
        width: 40,
        resizeMode: 'contain',
    },


    txtHello: {
        fontFamily: R.fonts.Bold,
        fontSize: 20,
        paddingBottom: 30
    },
    containerText: {
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '50%',
        paddingVertical: 20
    },
    containerHeaderTitle: {
        backgroundColor: R.colors.defaultColor,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
        width: '100%',
    },
    containerView3: {
        flex: 3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    containerView1: {
        height: height / 3,
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: 10
    },
    flex: {
        flex: 1
    },
})