import React, { Component } from 'react'
import { Text, View, StyleSheet, TextInput, StatusBar } from 'react-native'
import R from 'res/R'

class RootView extends Component {

  constructor(props) {
    super(props)
    this.SetDefaultText()

  }
  SetDefaultText = () => {
    let components = [Text, TextInput]
    const customProps = {
      style: {
        fontFamily: R.fonts.Regular,
        color: R.colors.black
      }
    }
    for (let i = 0; i < components.length; i++) {
      const TextRender = components[i].render;
      components[i].render = function (...args) {
        let origin = TextRender.call(this, ...args);
        return React.cloneElement(origin, {
          style: StyleSheet.flatten([customProps, origin.props.style])
        });
      };
    }
  }
  render() {
    return <View style={styles.container}>
      <StatusBar backgroundColor={R.colors.defaultColor} />
      {this.props.children}
    </View>
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
export default RootView
