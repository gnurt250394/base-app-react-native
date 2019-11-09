import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet, SectionList } from 'react-native';
import Container from 'library/Container';
import R from 'res/R';
import apis from 'configs/apis';

class NoteDoctorScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            type: ''
        };
    }
    componentDidMount = () => {
        this.getData()
    }
    getData = async () => {
        let res = await apis.fetch(apis.PATH.LIST_NOTE)
        if (res && res.code == 200) {
            this.setState({
                data: res.data,
                type: res.type
            })
        }
    }
    _keyExtractor = (item, index) => `${item.id || index}`
    _renderItem = ({ item, index }) => {
        if (item.type == '1' &&( this.state.type == '3' || this.state.type == '2')) {
            return (
                <View style={{ paddingTop: 10 }}>
                    <Text style={{
                        fontFamily: R.fonts.LightItalic,
                        color: R.colors.red
                    }}>- {item.name}</Text>

                    {/* <Text >({item.note})</Text> */}
                </View>
            )
        }
        return (
            <View >
                <Text style={{

                }}>- {item.name}</Text>
            </View>
        )
    }
    render() {
        const { data, list } = this.state
        return (
            <Container >
                <SectionList
                    sections={data}
                    style={{ padding: 10 }}
                    renderItem={this._renderItem}
                    keyExtractor={this._keyExtractor}
                    renderSectionHeader={({ section: { title } }) => (
                        <Text style={{
                            fontFamily: R.fonts.Bold,
                            fontSize: 16,
                            paddingVertical: 10,
                        }}>{title}</Text>
                    )}
                />

            </Container>
        );
    }
}

export default NoteDoctorScreen;
