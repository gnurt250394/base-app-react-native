import React, {Component} from 'react';
import {View, Text, ActivityIndicator, Modal, StyleSheet} from 'react-native';
import LoadingManager from './LoadingManager';
import * as Progress from 'react-native-progress';
import R from 'res/R';
import {width} from 'configs/utils';
import Spinner from 'react-native-spinkit';
const TIME_OUT = 20 * 1000;

export function showLoading() {
  const ref = LoadingManager.getDefault();

  if (!!ref) {
   return ref.showLoading();
  }
}

export function hideLoading() {
  const ref = LoadingManager.getDefault();

  if (!!ref) {
   return ref.hideLoading();
  }
}
class LoadingComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: 0,
      isLoading: false,
    };
  }
  componentWillUnmount() {
    if (this.loadingTimeout) clearTimeout(this.loadingTimeout);
  }

  hideLoading = () => {
    return new Promise((resolve, reject) => {
      if (this.loadingTimeout) clearTimeout(this.loadingTimeout);
      this.setState({isLoading: false}, () => {
        resolve();
      });
    });
  };

  showLoading = () => {
    return new Promise((resolve, reject) => {
      this.loadingTimeout = setTimeout(() => {
        this.setState({isLoading: false});
      }, TIME_OUT);
      console.log(1111);
      this.setState({isLoading: true}, () => {
        resolve();
      });
    });
  };

  render() {
    if (!this.state.isLoading) {
      return null;
    }
    return (
      // <Modal
      //   visible={this.state.isLoading}
      //   transparent={true}
      //   animationType="fade"
      //   onRequestClose={this.hideLoading}>
      <View
        style={{
          flex: 1,
          backgroundColor: R.colors.transparent,
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        }}>
        <Spinner
          style={styles.spinner}
          isVisible={true}
          size={40}
          type={'9CubeGrid'}
          color={'#FFFFFF'}
        />
      </View>
      // </Modal>
    );
  }
}

export default LoadingComponent;

const styles = StyleSheet.create({
  txtPercent: {
    color: R.colors.defaultColor,
    fontWeight: 'bold',
  },
  lottie: {
    width: 100,
    height: 100,
  },
});
