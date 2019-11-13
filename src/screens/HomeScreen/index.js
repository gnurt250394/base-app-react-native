/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from 'react-native';
import Container from 'library/Container';
import CanvasSketch from 'screens/CanvasSketch';
import { getLogin } from 'configs/apis/requestAuthen';
import DetectWithCamera from 'screens/DetectWithCamera';
class HomeScreen extends Component {
    constructor(props) {
        super(props)
    }
    componentDidMount = async () => {
        let res = await getLogin()
        console.log('res: ', res);
    };

    render() {
        return (
            <DetectWithCamera />
        );
    }
}

const styles = StyleSheet.create({
    example: {
        textAlign: 'center',
        fontWeight: 'bold',
        paddingTop: 20
    },

});

export default HomeScreen