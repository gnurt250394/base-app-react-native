import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
import R from 'res/R';
import ScaleText from 'components/TextScale';

class HomeNotAuthScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listButton: [
                {
                    id: 1,
                    onPress: '',
                    image: R.images.icons.home.ic_ehealth
                },
                {
                    id: 2,
                    onPress: '',
                    image: R.images.icons.home.ic_calendar
                },
                {
                    id: 3,
                    onPress: '',
                    image: R.images.icons.home.ic_drug
                },
                {
                    id: 4,
                    onPress: '',
                    image: R.images.icons.home.ic_doctor
                },

            ],
            data: [
                { id: 1, name: 'Tiểu đường' },
                { id: 2, name: 'Cao huyết áp' },
                { id: 3, name: 'Tim mạch' },
                { id: 4, name: 'Hen xuyễn' },
            ]
        };
    }
    _renderItem = ({ item, index }) => (
        <View style={styles.containerText}>
            <ScaleText>{item.name}</ScaleText>
        </View>
    )
    _keyExtractor = (item, index) => `${item.id || index}`
    headerComponent = () => (
        <View style={styles.headerList}>
            <ScaleText style={styles.txtHeaderList}>Chọn bệnh muốn hỗ trợ</ScaleText>
            <Image source={R.images.icons.home.ic_dropdown} style={[styles.imageDropdown, { tintColor: R.colors.white }]} />
        </View>
    )
    footerComponent = () => (
        <View style={[styles.containerText, {
            alignItems: 'center',

        }]}>
            <Image source={R.images.icons.home.ic_dropdown} style={styles.imageDropdown} />
        </View>

    )
    render() {
        const { listButton, data } = this.state
        return (
            <View style={styles.flex}>
                {/**view 1 */}
                <View style={styles.containerView1}>
                    <ScaleText size={20} style={styles.txtHello}>Xin chào,</ScaleText>
                    <ScaleText size={15} style={styles.txtHelper}>Bắt đầu theo dõi sức khỏe của bạn ngay với APP</ScaleText>
                    <View style={styles.containerHeaderTitle}>
                        <Image source={R.images.icons.home.ic_flamingo} style={styles.imageApp} />
                        <ScaleText size={17} style={styles.txtAppName}>Hồng hạc</ScaleText>
                    </View>

                </View>


                {/**view 2 */}
                <View style={styles.containerView2}>
                    <View style={styles.containerButton}>
                        {listButton.map((e, i) => {
                            return (
                                <TouchableOpacity key={i}>
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
                            data={data}
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
        paddingVertical: 5,
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