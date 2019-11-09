import React, { Component } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, FlatList, TextInput, ScrollView } from 'react-native';
import R from 'res/R';
import Container from 'library/Container';
import ScaleText from 'components/TextScale';
import NavigationServices from 'routes/NavigationServices';
import screenName from 'configs/screenName';
import utils, { height, width } from 'configs/utils';
import ActionSheet from 'react-native-actionsheet'
import PushNotification from 'components/PushNotification';
import { connect } from 'react-redux';
import Swiper from 'react-native-swiper'
import apis from 'configs/apis';
import FormQuestion1 from 'screens/Test/FormQuestion1';
import FormQuestion2 from 'screens/Test/FormQuestion2';
class TestTodayScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [
                {
                    _id: 0
                },
                {
                    _id: 1,
                },
                {
                    _id: 2,
                },
                {
                    _id: 4,
                },
                {
                    _id: 3,

                },
                {
                    _id: 5,

                },

            ],
            listChecked: [],
            listInput: [],
            currentIndex: 0,
            listFinal: [],
            selected: false,
            value: this.props.navigation.getParam('value', ''),
            disease_id: (this.props.navigation.getParam('item', {}) || {})._id || '',
            height: 0
        };
        this.list = []
        this.data = []
    }
    componentDidMount() {
        this.getData()
    }
    groupObj = (myArray) => {
        var group_to_values = myArray.reduce(function (obj, item) {
            let a ={}
            obj[item.position] = obj[item.position] || [];
            obj[item.position].push(item);
            return obj;
        }, {});

        var groups = Object.keys(group_to_values).map(function (key) {
            return { _id: key, itemsQuestion: group_to_values[key] };
        });
        return groups
    }
    getData = async () => {
        try {
            let { disease_id } = this.state
            let res = await apis.fetch(apis.PATH.QUESTION, { type: 2, disease_id })

            if (res && res.code == 200) {
                let data = [...res.data]

                let list = this.groupObj(data)
                console.log('list: ', list);
                this.setState({ data: list, disease_id: res.disease_id })
            }
        } catch (error) {

        }

    }
    backQuestion = (item) => async () => {
        const { data, currentIndex, listChecked, selected } = this.state
        if (data && currentIndex > 0 && currentIndex <= data.length - 1) {
            this.swiper && this.swiper.scrollTo(currentIndex - 1)
        }

        this.checkList(item)
    }
    renderText = () => {
        const { value } = this.state
        let message = ''
        if (value < 4) {
            message = 'Chỉ số đường huyết của bạn hơi cao'
        } else if (value >= 4 && value < 6) {
            message = 'Chỉ số đường huyết của bạn hơi cao'

        } else if (value >= 6 && value < 7) {
            message = 'Chỉ số đường huyết của bạn hơi cao'

        } else if (value >= 7 && value < 9) {
            message = 'Chỉ số đường huyết của bạn hơi cao'

        } else {
            message = 'Chỉ số đường huyết của bạn cao vượt mức cho phép'

        }
    }
    onPressCkeck = (item) => (e) => {
        let listChecked = [];
        let data = [...this.state.data]
        data.forEach(element => {
            if (element._id == item._id) {
                element.itemsQuestion.forEach(elm => {
                    if (item.type == 3) {
                        listChecked = elm.anwser.filter(element => element.checked == true)

                    } else {
                        let index = this.list.findIndex(element => e._id == element._id)
                        if (index == -1) {
                            this.list.push(e)
                            listChecked = this.list
                        } else {
                            this.list.splice(index, 1, e)
                            listChecked = this.list
                        }

                    }
                })


            }
        })
        this.setState({ listChecked: listChecked, data: data, selected: true }, () => {
            console.log(this.state.listChecked, 'listChecked')
        })

        // this.setState({
        //     data: list
        // })
    }
    checkList = (item) => {
        const { listChecked, selected } = this.state
        this.list = []

        if (Array.isArray(listChecked) && listChecked.length > 0 && selected) {
            let data = listChecked.filter(e => e.checked == true)
            let total = data.reduce((total, current) => {
                return total + Number(current.total)
            }, 0)
            console.log('total: ', total);
            let obj = {}
            obj.point = total
            obj._id = item._id
            let index = this.data.findIndex(e => e._id == item._id)
            if (index == -1) {
                this.data.push(obj)
            } else {
                this.data.splice(index, 1, obj)

            }
            console.log('this.data: ', this.data);
            this.setState({ selected: false })
        }
    }
    onSend = (item) => async () => {

        try {
            this.checkList(item)
            let point = this.data.reduce((total, current) => {
                return total + parseInt(current.point)
            }, 0)

            let { disease_id } = this.state
            console.log('disease_id: ', disease_id);
            let res = await apis.post(apis.PATH.CONFIRM_ANWSER, { point, disease_id, glycemic: this.state.value })

            if (res && res.code == 200) {
                utils.alertSuccess('Gửi câu hỏi thành công')
                NavigationServices.navigate(screenName.TestResultScreen, {
                    type: res.data.type,
                    status: 1
                })
            } else {
                utils.alertDanger(res.message)
            }
        } catch (error) {


        }

    }
    onChangeText = (item) => (value, itemAnwser) => {
        console.log('item: ', item);

        let point = Number(value)

        itemAnwser.anwser.sort((a, b) => b.from_point - a.from_point || b.to_point - a.total_point)
        let objPoint = itemAnwser.anwser.find(e => point >= e.from_point && point <= e.to_point || point < itemAnwser.anwser[0].from_point || point > itemAnwser.anwser[itemAnwser.anwser.length - 1].to_point)
        console.log('objPoint: ', objPoint);


        let list = []
        item.itemsQuestion.forEach(e => {
            if (e._id == itemAnwser._id) {
                if (objPoint && objPoint._id) {
                    let obj = {
                        anwser_id: itemAnwser._id,
                        name: value,
                        point: objPoint.total,
                        glycemic: point,
                        _id: itemAnwser._id,
                        checked: true
                    }
                    list.push(obj)


                }
            }
        })
        console.log('list: ', list);
        this.setState({ listChecked: list, selected: true, value: point }, () => {



        })
    }
    _renderItem = ({ item, index }) => {
        switch (index) {
            case 0:
            // return <FormQuestion1
            //     key={`${item._id}`}
            //     onPress={this.nextQuestion(item)}
            //     onPressBack={this.backQuestion(item)}
            //     index={index}
            //     length={this.state.data.length} />
            default:
                return <FormQuestion2
                    key={`${item._id}`}
                    onPress={this.nextQuestion(item)}
                    onPressBack={this.backQuestion(item)}
                    onChangeText={this.onChangeText(item)}
                    index={index}
                    // onLayout={(e) => {
                    //     console.log('e: ', e.nativeEvent.layout);
                    //     this.setState({ height: e.nativeEvent.layout.height })
                    // }}
                    item={item}
                    onSend={this.onSend(item)}
                    onPressCheck={this.onPressCkeck(item)}
                    length={this.state.data.length}
                />
        }

    }
    _keyExtractor = (item, index) => `${item._id || index}`
    nextQuestion = (item) => async () => {

        const { data, currentIndex, listChecked, selected } = this.state

        if (data && data.length - 1 > currentIndex) {
            this.swiper && this.swiper.scrollTo(this.state.currentIndex + 1)
        }

        this.checkList(item)
    }
    onIndexChanged = (currentIndex) => {

        this.setState({ currentIndex })
    }
    onReport = () => {
        NavigationServices.navigate(screenName.ReportScreen)
    }
    render() {
        const { userApp } = this.props
        const { listButton, data } = this.state
        return (
            <Container
                scrollView={true}
            >
                <View style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: height / 4 - 30
                }}>
                    <ScaleText size={20} style={styles.txtHello}>Xin chào, <ScaleText fontFamily="boldItalic" size={20} style={{
                        color: R.colors.defaultColor
                    }}>{userApp.name}</ScaleText></ScaleText>
                    <ScaleText fontFamily="thinItalic" size={16} style={styles.TxtQuestion} >Trả lời ngay các câu hỏi sau đây để đánh giá tình trạng sức khỏe của bạn</ScaleText>

                </View>

                {/** form question */}
                <View style={{
                    alignItems: 'center'
                }}>
                    <Swiper
                        loop={false}
                        onIndexChanged={this.onIndexChanged}
                        scrollEnabled={true}
                        showsPagination={false}
                        // scrollViewStyle={{
                        //     maxHeight: this.state.height
                        // }}
                        // horizontal={false}
                        ref={ref => this.swiper = ref}
                        style={styles.containerHeaderTitle}
                        showsButtons={false}>
                        {

                            data && data.length > 0 ? data.map((item, index) => {
                                return this._renderItem({ item, index })
                            }) : <View />}
                    </Swiper>
                    <TouchableOpacity
                        onPress={this.onReport}
                        style={styles.buttonWarning}>
                        <Image source={R.images.icons.home.ic_warning} style={styles.imageWarning} />
                        <ScaleText>Báo cáo dấu hiệu bất thường</ScaleText>
                    </TouchableOpacity>
                </View>


            </Container>
        );
    }
}
const mapStateToProps = (state) => ({
    userApp: state.loginReducer.userApp
});
const mapDispatchToProps = (dispatch) => ({

});
export default connect(mapStateToProps)(TestTodayScreen);

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
    TxtQuestion: {
        color: R.colors.black3,
        fontFamily: R.fonts.Regular,
        textAlign: 'center',
        paddingBottom: 20,
        paddingHorizontal: 10
    },

    txtHello: {
        fontFamily: R.fonts.Bold,
        paddingBottom: 5
    },
    containerHeaderTitle: {
        // backgroundColor: R.colors.defaultColor,
        // width: null,
        // height: height / 2,
    },
    flex: {
        flex: 1
    },
    button: {
        paddingHorizontal: 10
    },
    txtBetween: {
        paddingHorizontal: 15,
        paddingVertical: 6,
        backgroundColor: R.colors.white
    },
    imageBack: {
        height: 22,
        width: 22,
        resizeMode: 'contain'
    },
    containerPage: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        paddingTop: 20,
    },
})