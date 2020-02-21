import React, { useRef, useEffect } from 'react'
import ComponentB from './ComponentB'
import { TouchableOpacity } from 'react-native'

const ComponentA = (props, ref) => {
    const comA = useRef()

    ///sử dụng ref
    const onPressDemo = () => {
        comA.current.onPress()
    }


    useEffect(() => {
        //component didmount

        return () => {
            // component willUnmount
        }
    }, [])
    useEffect(() => {
        //componentDidUpdate
    })
    useEffect(() => {
        //componentDidupdate
    }, [props, state])
    return (
        <View>
            <TouchableOpacity
                style={{
                    backgroundColor: 'green',
                    height: 100,
                    width: 200,
                    alignSelf: 'center',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                onPress={onPressDemo}>
                <Text>Click</Text>
            </TouchableOpacity>
            <ComponentB ref={comA} />
        </View>
    )
}

export default ComponentA
