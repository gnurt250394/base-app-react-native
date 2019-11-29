import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Canvas from 'react-native-canvas';

class CanvasScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    handleCanvas = (canvas) => {
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'purple';
        ctx.fillRect(0, 0, 500, 500);
    }
    render() {
        return (
            <View>
                <Canvas ref={this.handleCanvas} style={{ backgroundColor: 'red', width: '100%' }} />
            </View>
        );
    }
}

export default CanvasScreen;
