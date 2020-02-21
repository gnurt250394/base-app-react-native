import React, { useRef, useImperativeHandle ,fontSize, forwardRef} from 'react'
import { View, Text, TouchableOpacity } from 'react-native';

const ComponentB = (props, ref) => {
    console.log('ref: ', ref);
    useImperativeHandle(ref, () => {
        onPress: onPressDemo
    })
    const onPressDemo = () => {
        alert('aaaa')
    }
    return (
        <View>
            <Text>Demo</Text>
        </View>
    )
}

export default forwardRef(ComponentB)
