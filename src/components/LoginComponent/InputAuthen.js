import React, {Component} from 'react';
import {Text, View, TextInput, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import R from 'res/R';
import {showMessage} from 'react-native-flash-message';
class InputAuthen extends Component {
  state = {
    value: this.props.value || '',
  };

  onChangeText = value => {
    this.setState({value});
  };
  onBlur = () => {
    const {value} = this.state;
    const {placeholder} = this.props;
    if (!value) {
      showMessage({
        icon: 'danger',
        type: 'danger',
        message: 'Lỗi!',
        description: `${placeholder} không được để trống`,
      });
    }
  };
  getValue = () => {
    return this.state.value;
  };
  render() {
    const {
      placeholder,
      style,
      label,
      reqiure,
      containerStyle,
      ...otherProps
    } = this.props;
    const {value} = this.state;
    return (
      <View style={[styles.container, containerStyle]}>
        <Text style={{}}>
          {label}{' '}
          {reqiure && (
            <Text
              style={{
                color: R.colors.red,
              }}>
              (*)
            </Text>
          )}
        </Text>
        <TextInput
          {...otherProps}
          placeholder={placeholder}
          value={value}
          onChangeText={this.onChangeText}
          style={[styles.input, style]}
          onBlur={this.onBlur}
        />
      </View>
    );
  }
}
InputAuthen.defaultProps = {
  placeholder: 'Enter....',
};
InputAuthen.prototype.props = {
  placeholder: PropTypes.string,
  style: PropTypes.object,
  label: PropTypes.string,
  reqiure: PropTypes.string,
  containerStyle: PropTypes.object,
};
export default InputAuthen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  input: {
    borderColor: R.colors.defaultColor,
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 5,
  },
});
