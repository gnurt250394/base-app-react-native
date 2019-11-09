import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Container from 'library/Container';
import R from 'res/R';
import apis from 'configs/apis';
import moment from 'moment';
class DetailDrugScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            detailsDrug: {},
            item: this.props.navigation.getParam('item', {})
        };
    }
    componentDidMount() {
        this.getData()
    }
    getData = async () => {
        let id = this.state.item && this.state.item._id
        let res = await apis.fetch(apis.PATH.DETAIL_PRESCRIPTION + '/' + id)
        if (res && res.code == 200) {
            this.setState({ detailsDrug: res.data })
        }
    }

    render() {
        const { detailsDrug } = this.state
        return (
            <Container>
                <View style={styles.container}>
                    <Text style={styles.txtNameDrug}>{detailsDrug.name}</Text>
                    <Text style={styles.txtTime}>Ngày tạo: {moment(detailsDrug.create_at).format('DD/MM/YYYY')}</Text>
                    <View style={styles.container}>
                        <Text style={styles.txtFont}>- Chẩn đoán: <Text>{detailsDrug.diagnose}</Text></Text>
                        <View>
                            <Text style={styles.txtDrug}>- Thuốc điều trị:</Text>
                            {detailsDrug && detailsDrug.drugs && detailsDrug.drugs.length > 0
                                ?
                                detailsDrug.drugs.map((e, i) => {
                                    return (
                                        <Text style={{
                                            color: R.colors.textColor,
                                            fontFamily: R.fonts.Semibold,
                                            paddingLeft: 15,
                                            paddingBottom: 10,
                                        }} key={i}><View style={{
                                            height:6,
                                            width:6,
                                            borderRadius:3,
                                            backgroundColor:R.colors.textColor
                                        }} /> {e.name}</Text>
                                    )
                                })
                                : null
                            }
                        </View>
                        <Text style={styles.txtFont}>- Lời dặn: <Text>{detailsDrug.advice}</Text></Text>
                    </View>
                    <Text style={styles.txtHelp}>Khám lại xin mang theo đơn này</Text>
                </View>
            </Container>
        );
    }
}

export default DetailDrugScreen;


const styles = StyleSheet.create({
    txtHelp: {
        textAlign: 'center',
        fontFamily: R.fonts.LightItalic,
        fontSize: 15,
        paddingTop: 15
    },
    txtFont: {
        color: R.colors.black,
        fontFamily: R.fonts.Medium
    },
    txtDrug: {
        paddingVertical: 10,
        color: R.colors.black,
        fontFamily: R.fonts.Medium
    },
    txtTime: {
        color: R.colors.gray,
        paddingTop: 5,
        fontFamily: R.fonts.MediumItalic
    },
    txtNameDrug: {
        color: R.colors.defaultColor,
        fontFamily: R.fonts.Heavy,
        fontSize: 16
    },
    container: {
        padding: 10,
    },
})