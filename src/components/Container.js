import React, {Component, memo} from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  ScrollView,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import HeaderDefault from 'components/HeaderDefault';
import PropTypes from 'prop-types';
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
} from 'rn-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import R from 'res/R';

const Container = ({
  onPressLeft,
  onPressRight,
  valueRight,
  iconRight,
  valueLeft,
  iconLeft,
  title,
  styleHeader,
  style,
  isBack,
  children,
}) => {
  return (
    <View style={styles.container}>
      <HeaderDefault
        onPressLeft={onPressLeft}
        onPressRight={onPressRight}
        valueRight={valueRight}
        iconRight={iconRight}
        iconLeft={iconLeft}
        title={title}
        valueLeft={valueLeft}
        styleHeader={styleHeader}
        isBack={isBack}
      />
      <StatusBar
        animated={true}
        backgroundColor={R.colors.blue}
        barStyle="light-content"
      />
      <SafeAreaView style={styles.container}>
        <View style={[styles.containerComponent, style]}>{children}</View>
      </SafeAreaView>
    </View>
  );
};
export default memo(Container);

const styles = StyleSheet.create({
  container: {flex: 1},
  containerComponent: {
    backgroundColor: '#fff',
    flex: 1,
  },
  container: {
    flex: 1,
  },
  lottie: {
    width: 100,
    height: 100,
  },
});
