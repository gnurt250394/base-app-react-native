import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import screenName from 'configs/screenName';

class SelectRoomScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roomID: ''
        };
    }
    _press = () => {

        this.props.navigation.navigate(screenName.VideoCall, { roomID: this.state.roomID })

    }
    render() {
        return (
            <View>
                <TextInput
                    ref='roomID'
                    autoCorrect={false}
                    style={{
                        
                    }}
                    onChangeText={(text) => this.setState({ roomID: text })}
                    value={this.state.roomID}
                />
                <TouchableOpacity
                    onPress={this._press}>
                    <Text>Enter room</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

export default SelectRoomScreen;
