import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
import R from 'res/R';
import ScaleText from 'components/TextScale';
import apis from 'configs/apis';
import NavigationServices from 'routes/NavigationServices';
import screenName from 'configs/screenName';

class HomeNotAuthScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listButton: [
                {
                    id: 1,
                    onPress: () => {
                        NavigationServices.navigate(screenName.LoginScreen, {
                            nextScreen: screenName.FollowHealthScreen
                        })
                    },
                    image: R.images.icons.home.ic_ehealth
                },
                {
                    id: 2,
                    onPress: () => {
                        NavigationServices.navigate(screenName.LoginScreen, {
                            nextScreen: screenName.ScheduleScreen
                        })
                    },
                    image: R.images.icons.home.ic_calendar
                },
                {
                    id: 3,
                    onPress: () => {
                        NavigationServices.navigate(screenName.LoginScreen, {
                            nextScreen: screenName.DrugScreen
                        })
                    },
                    image: R.images.icons.home.ic_drug
                },
                {
                    id: 4,
                    onPress: () => {
                        NavigationServices.navigate(screenName.LoginScreen, {
                            nextScreen: screenName.ListDoctorScreen
                        })
                    },
                    image: R.images.icons.home.ic_doctor
                },

            ],
            data: []
        };
    }
    componentDidMount() {
        this.getData()
    }
    getData = async () => {
        let res = await apis.fetch(apis.PATH.SICK)
        if (res && res.code == 200) {
            this.setState({ data: res.data })
        }
    }
    onLogin = (item) => () => {
        NavigationServices.navigate(screenName.LoginScreen, {
            nextScreen: screenName.TestTodayScreen,
            item,
            type: 'today'
        })
    }
    _renderItem = ({ item, index }) => (
        <TouchableOpacity
            onPress={this.onLogin(item)}
            style={styles.containerText}>
            <ScaleText>{item.name}</ScaleText>
        </TouchableOpacity>
    )
    _keyExtractor = (item, index) => `${item.id || index}`
    headerComponent = () => (
        <TouchableOpacity style={styles.headerList}>
            <ScaleText style={styles.txtHeaderList}>Chọn bệnh muốn hỗ trợ</ScaleText>
            <Image source={R.images.icons.home.ic_dropdown} style={[styles.imageDropdown, { tintColor: R.colors.white }]} />
        </TouchableOpacity>
    )
    showMoreItem = () => {
        NavigationServices.navigate(screenName.GetAllSickScreen, {
            data: this.state.data,
            type: 'showMore'
        })
    }
    footerComponent = () => (
        <TouchableOpacity
            onPress={this.showMoreItem}
            style={[styles.containerText, {
                alignItems: 'center',
                borderTopColor: R.colors.gray,
                borderTopWidth: 1
            }]}>
            <Image source={R.images.icons.home.ic_dropdown} style={styles.imageDropdown} />
        </TouchableOpacity>

    )
    render() {
        const { listButton, data } = this.state
        return (
            <View style={styles.flex}>
                {/**view 1 */}
                <View style={styles.containerView1}>
                    <ScaleText fontFamily="bold" size={20} style={styles.txtHello}>Xin chào</ScaleText>
                    <ScaleText fontFamily="mediumItalic" size={15} style={styles.txtHelper}>Bắt đầu theo dõi sức khỏe của bạn ngay với</ScaleText>
                    <View style={styles.containerHeaderTitle}>
                        <Image source={R.images.icons.home.ic_flamingo} style={styles.imageApp} />
                        <ScaleText fontFamily="heavy" size={18} style={styles.txtAppName}>Hồng hạc</ScaleText>
                    </View>

                </View>


                {/**view 2 */}
                <View style={styles.containerView2}>
                    <View style={styles.containerButton}>
                        {listButton.map((e, i) => {
                            return (
                                <TouchableOpacity
                                    onPress={e.onPress}
                                    key={i}>
                                    <Image source={e.image} style={styles.imageButton} />
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                </View>

                {/**view 3 */}
                <View style={styles.containerView3}>
                    <View style={styles.containerList}>

                        <FlatList
                            data={data.slice(0, 4)}
                            renderItem={this._renderItem}
                            keyExtractor={this._keyExtractor}
                            ListHeaderComponent={this.headerComponent}
                            ListFooterComponent={this.footerComponent}
                        />


                    </View>

                </View>
            </View>
        );
    }
}

export default HomeNotAuthScreen;


const styles = StyleSheet.create({
    txtAppName: {
        fontFamily: R.fonts.BoldItalic,
        color: R.colors.defaultColor,
    },
    txtHelper: {
        fontFamily: R.fonts.Regular,
        paddingBottom: 20
    },
    txtHello: {
        fontFamily: R.fonts.Bold,
        paddingBottom: 30
    },
    containerText: {
        backgroundColor: R.colors.secondColor,
        paddingVertical: 10,
        paddingHorizontal: 10,
        paddingLeft: 10
    },
    imageDropdown: {
        height: 24,
        width: 24,
        resizeMode: 'contain',

    },
    txtHeaderList: {
        fontFamily: R.fonts.Bold,
        paddingRight: 10
    },
    headerList: {
        backgroundColor: R.colors.defaultColor,
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 10
    },
    containerList: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    imageButton: {
        height: 30,
        width: 30,
        resizeMode: 'contain'
    },
    containerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    imageApp: {
        height: 50,
        width: 50,
        resizeMode: 'contain'
    },
    containerHeaderTitle: {
        alignItems: 'center',
        flexDirection: 'row',
        paddingTop: 20
    },
    containerView3: {
        flex: 2,
    },
    containerView2: {
        flex: 1,
        justifyContent: 'center'
    },
    containerView1: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: 10
    },
    flex: {
        flex: 1
    },
})