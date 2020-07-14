import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {showLoading, hideLoading} from 'components/Loading/LoadingComponent';
import Container from 'components/Container';
import FlashMessage from 'configs/FlashMessage';
import {getlistMessage} from 'configs/apis/getListMessage';
import NavigationServices from 'routes/NavigationServices';
import screenName from 'configs/screenName';
import FloatingLabelInput from 'components/FloatInput';

const LoginScreen = () => {
  const [userName, setUserName] = useState('');
  const onClick = () => {
    // showLoading();
    // getlistMessage(1, 1);
    // FlashMessage.show('message', 'danger', 6000);
    NavigationServices.navigate(screenName.HOME);
  };
  return (
    <Container title={'Login'} style={styles.container}>
      <FloatingLabelInput
        label="Email"
        value={this.state.value}
        onChangeText={this.handleTextChange}
      />
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
