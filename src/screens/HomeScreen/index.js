/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import Container from 'components/Container';
import {getLogin} from 'configs/apis/requestAuthen';
import utils from 'configs/utils';
class HomeScreen extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount = async () => {};

  render() {
    return (
      <Container title="Home" style={styles.container}>
        <Text>Home</Text>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HomeScreen;
