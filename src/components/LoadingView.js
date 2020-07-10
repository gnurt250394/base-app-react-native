import React from 'react';
import {View, StyleSheet} from 'react-native';
import Spinner from 'react-native-spinkit';

const LoadingView = () => {
  return (
    <View style={styles.container}>
      <Spinner
        style={styles.spinner}
        isVisible={true}
        size={40}
        type={'9CubeGrid'}
        color={'#FFFFFF'}
      />
    </View>
  );
};

export default LoadingView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
