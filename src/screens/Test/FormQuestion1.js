import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image } from 'react-native';
import ScaleText from 'components/TextScale';
import DatePicker from 'react-native-datepicker'
import R from 'res/R';
import { width } from 'configs/utils';
class FormQuestion1 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: '',
            height: '',
            weight: '',
            BMI: ''
        };
    }
    onChangeText = (state) => (value) => {
        this.setState({ [state]: value }, () => {
            const { date, height, weight } = this.state
            if (height && weight) {
                if (this.timeout) clearTimeout(this.timeout)
                this.timeout = setTimeout(() => {
                    let BMI = weight / ((height / 100) * (height / 100))
                    this.setState({ BMI: BMI.toFixed(2) })
                }, 10)


            }
        })

    }
    render() {
        const { BMI } = this.state
        const { index, length } = this.props

        return (
            <View style={styles.container}>
                <View style={{ }}>
                    <Text style={styles.txtDate}>Ngày tháng năm sinh</Text>
                    <DatePicker
                        style={{ width:'40%' }}
                        date={this.state.date}
                        mode="date"
                        placeholder="dd/mm/yyyy"
                        format="DD/MM/YYYY"
                        confirmBtnText="Xác nhận"
                        cancelBtnText="Hủy"
                        showIcon={false}
                        customStyles={{
                            dateInput: styles.dateInput,
                            placeholderText: {
                                color: R.colors.textColor
                            }
                            // ... You can check the source to find the other keys.
                        }}
                        onDateChange={(date) => { this.setState({ date }) }}
                    />
                    <View style={styles.containerHeightWeight}>
                        <View style={styles.width40}>
                            <Text style={styles.txtHeight}>Chiều cao</Text>
                            <TextInput
                                keyboardType="numeric"
                                style={styles.inputHeight}
                                placeholder="cm"
                                placeholderTextColor={R.colors.textColor}
                                onChangeText={this.onChangeText('height')}
                            />
                        </View>
                        <View style={styles.width40}>
                            <Text style={styles.txtHeight}>Cân nặng</Text>
                            <TextInput
                                keyboardType="numeric"
                                placeholderTextColor={R.colors.textColor}
                                style={styles.inputHeight}
                                placeholder="kg"
                                onChangeText={this.onChangeText('weight')}
                            />
                        </View>
                    </View>
                    {
                        BMI ? <Text style={styles.txtBMI}>BMI của bạn là <Text style={{ color: R.colors.textColor }}>({BMI})</Text></Text> : null
                    }
                </View>
                <View style={styles.containerPage}>
                
                    <TouchableOpacity
                        onPress={this.props.onPressBack}
                        style={styles.button}>
                        <Image source={R.images.icons.ic_back_arrow} style={[styles.imageBack,{tintColor:index == 0 ? R.colors.gray:R.colors.white}]} />
                    </TouchableOpacity>
                    <Text style={styles.txtBetween}>{index + 1}/{length}</Text>
                    <TouchableOpacity
                        onPress={this.props.onPress}
                        style={styles.button}>
                        <Image source={R.images.icons.ic_next_arrow} style={styles.imageBack} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        padding: 10,
        justifyContent: 'center',
        backgroundColor:R.colors.white
    },
    txtDate: {
        paddingBottom: 6,
        color: R.colors.defaultColor,
        fontFamily: R.fonts.Bold
    },
    button: {
        paddingHorizontal: 10
    },
    txtBetween: {
        paddingHorizontal: 15,
        paddingVertical: 6,
        backgroundColor: R.colors.textColor,
        color:R.colors.white
    },
    imageBack: {
        height: 22,
        width: 22,
        resizeMode: 'contain',
        tintColor:R.colors.textColor
    },
    containerPage: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        paddingTop: 50,
    },
    txtBMI: {
        textAlign: 'center',
        paddingVertical: 10,
        fontFamily: R.fonts.Bold
    },
    inputHeight: {
        backgroundColor: R.colors.white,
        borderRadius: 5,
        height: 40,
        borderColor:R.colors.black9,
        borderWidth:1,
    },
    txtHeight: {
        color: R.colors.defaultColor,
        paddingTop: 10,
        paddingBottom: 5,
        fontFamily: R.fonts.Bold
    },
    width40: { width: '40%' },
    containerHeightWeight: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    dateInput: {
        backgroundColor: R.colors.white,
        borderRadius: 5,
        alignItems: 'flex-start',
        paddingLeft: 10,
    },

});
export default FormQuestion1;
