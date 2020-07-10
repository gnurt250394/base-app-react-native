import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {showLoading, hideLoading} from 'components/Loading/LoadingComponent';
import Container from 'components/Container';
import FlashMessage from 'configs/FlashMessage';
import {getlistMessage} from 'configs/apis/getListMessage';
import NavigationServices from 'routes/NavigationServices';
import screenName from 'configs/screenName';

const LoginScreen = () => {
  const onClick = () => {
    // showLoading();
    // getlistMessage(1, 1);
    // FlashMessage.show('message', 'danger', 6000);
    NavigationServices.navigate(screenName.HOME)
  };
  return (
    <Container title={'Login'} style={styles.container}>
      <Text>LOGIN</Text>
    </Container>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
