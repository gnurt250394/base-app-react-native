import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import R from 'res/R';
import Container from 'library/Container';
import NavigationServices from 'routes/NavigationServices';
import screenName from 'configs/screenName';
import apis from 'configs/apis';
import { LineChart, Grid, YAxis, XAxis } from 'react-native-svg-charts'
import { height } from 'configs/utils';

class TestResultScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: this.props.navigation.getParam('type', 1),
            data: [],
            dataChart: [],
            listTime: [],
            status: this.props.navigation.getParam('status', '')
        };
    }
    componentDidMount = () => {
        this.getData()
    };

    getData = async () => {
        let res = await apis.fetch(apis.PATH.LIST_FOLLOW)
        if (res && res.code == 200) {
            this.setState({ data: res.data, dataChart: res.listPoint, listTime: res.listTime })
        }
    }
    renderType = () => {
        console.log(this.state.type)
        switch (this.state.type) {
            case '1': return 'Chỉ số trong ngưỡng an toàn \nĐề nghị duy trì chế độ'
            case '2': return 'Chỉ số vượt ngưỡng an toàn \nĐề nghị điều chỉnh chế độ theo '
            case '3': return 'Chỉ số đáng lo ngại! \n Đề nghị liên hệ bác sĩ để được khám ngay'
            default: return 'aaaaa'
        }
    }
    renderImage = () => {
        switch (this.state.type) {
            case '1': return R.images.icons.follow_health.ic_success
            case '2': return R.images.icons.follow_health.ic_warning
            case '3': return R.images.icons.follow_health.ic_danger
            default: return R.images.icons.follow_health.ic_success
        }
    }
    getRating = (item) => {
        const type = item.type
        if (type == '1') {
            return R.colors.green
        } else if (type == '2') {
            return R.colors.orange
        } else {
            return R.colors.red
        }
    }
    formatDate = (item) => {
        return moment(item.create_at).format('DD')
    }
    goHome = () => {
        NavigationServices.navigate(screenName.HomeScreen)
    }
    _renderItem = ({ item, index }) => {
        const data = [50, 40, 50, 20]
        return (
            <View key={index}>
                <Text style={{
                    paddingHorizontal: 12
                }}>{item.create_at}</Text>
                <View style={[styles.viewDots, { backgroundColor: this.getRating(item) }]} />

            </View>
        )
    }
    headerComponent = () => {
        return (
            <View style={styles.containerheader}>
                <Text style={{
                    color: R.colors.black,
                    fontFamily: R.fonts.Semibold
                }}>Chọn bác sỹ để được tư vấn</Text>
            </View>
        )
    }
    renderLineChart = (data, listTime) => {
        console.log('listTime: ', listTime);
        console.log('data: ', data);
        const contentInset = { top: 20, bottom: 20 }
        return (
            <View style={{ height: height / 4, flexDirection: 'row', paddingLeft: 5 }}>
                <YAxis
                    data={data}
                    contentInset={{ top: 35, bottom: 20 }}
                    svg={{
                        fill: 'grey',
                        fontSize: 10,
                    }}
                    numberOfTicks={10}
                    formatLabel={(value) => `${value}`}
                />
                <View style={{ flex: 1 }}>
                    <XAxis
                        style={{ marginHorizontal: -10 }}
                        data={data}
                        formatLabel={(value, index) => listTime && listTime.length > 0 ? listTime[index] : index}
                        contentInset={{ left: 20, right: 20 }}
                        svg={{ fontSize: 10, fill: 'black' }}
                    />
                    <LineChart
                        style={{ flex: 1, paddingHorizontal: 10 }}
                        data={data}
                        animate={true}
                        svg={{ stroke: 'rgb(134, 65, 244)' }}
                        contentInset={contentInset}
                    >
                        <Grid />
                    </LineChart>
                </View>
            </View>
        )
    }
    goToNote=()=>{
        NavigationServices.navigate(screenName.NoteDoctorScreen)
    }
    _keyExtractor = (item, index) => `${item._id || index}`
    render() {
        const { data, dataChart, listTime } = this.state
        return (
            <View style={styles.containerAlert}>
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Image source={this.renderImage()} style={styles.imageAlert} />
                    <Text style={styles.txtAlert}>{this.renderType()} </Text>
                    {
                        // this.state.type == '2' ?
                            <TouchableOpacity
                                onPress={this.goToNote}
                                style={{
                                    paddingTop:10
                                }}
                            >
                                <Text style={{
                                    fontFamily: R.fonts.Bold,
                                    textDecorationLine:'underline'
                                }}>Lời dặn của bác sĩ</Text>
                            </TouchableOpacity>
                            // : null

                    }
                </View>
                {
                    this.state.type == 3 && this.state.status ?
                        <View >
                            <Text style={styles.txtTitle}>Đánh giá chung</Text>

                            <FlatList
                                data={data}
                                showsHorizontalScrollIndicator={false}
                                horizontal={true}
                                renderItem={this._renderItem}
                                keyExtractor={this._keyExtractor}
                            />
                            <Text style={styles.txtTitle} >Chỉ số đường huyết</Text>
                            {this.renderLineChart(dataChart, listTime)}
                        </View>
                        : null
                }

                <View style={{
                    flex: 2,
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    paddingBottom: 35
                }}>
                    <TouchableOpacity
                        onPress={this.goHome}
                        style={{
                            backgroundColor: R.colors.blue,
                            borderRadius: 10,
                            paddingHorizontal: 10,
                            height: 50,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                        <Text style={{
                            color: R.colors.white,
                            fontFamily: R.fonts.Heavy,
                            fontSize: 17
                        }}>Về trang chủ</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

export default TestResultScreen;


const styles = StyleSheet.create({
    viewDots: {
        height: 20,
        width: 20,
        borderRadius: 10,
        marginVertical: 7,
        marginHorizontal: 10
    },
    txtTitle: {
        alignSelf: 'center',
        paddingVertical: 10,
        fontFamily: R.fonts.Bold
    },
    containerheader: {
        backgroundColor: R.colors.secondColor,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5
    },
    txtname: {
        color: R.colors.white,
        fontFamily: R.fonts.Bold,
        paddingLeft: 10,
    },
    avatar: {
        height: 30,
        width: 30,
        borderRadius: 15
    },
    containerItem: {
        paddingVertical: 15,
        paddingLeft: 10,
        backgroundColor: R.colors.defaultColor,
        flexDirection: 'row',
        alignItems: 'center'
    },
    txtAlert: {
        textAlign: 'center',
        fontFamily: R.fonts.Regular,
        paddingHorizontal: 40
    },
    containerAlert: {
        flex: 1
    },
    imageAlert: {
        height: 50,
        width: 50,
        resizeMode: 'contain',
        marginBottom: 20
    },
})