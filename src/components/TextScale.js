import React from 'react';
import {Dimensions, StyleSheet, Text} from 'react-native';
import PropTypes from 'prop-types';
import R from 'res/R';
const {width} = Dimensions.get('window');

const getAdjustedFontSize = size => {
  return (parseInt(size) * width * (1.8 - 0.002 * width)) / 400;
};

class ScaleText extends React.Component {
  render() {
    return (
      <Text
        {...this.props}
        style={[
          this.props.style,
          {fontSize: getAdjustedFontSize(this.props.size)},
        ]}>
        {this.props.children}
      </Text>
    );
  }
}
ScaleText.defaultProps = {
  size: 14,
};
ScaleText.propTypes = {
  size: PropTypes.number,
  style: PropTypes.object,
};
export default ScaleText;

ScaleText.prototype.props = {
  size: PropTypes.string,
  style: PropTypes.object,
};
