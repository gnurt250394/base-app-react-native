import React, {Component, memo} from 'react';
import {
  Text,
  View,
  StyleSheet,
  PixelRatio,
  StatusBar,
  Platform,
} from 'react-native';
import ButtonBase from 'components/ButtonBase';
import NavigationServices from 'routes/NavigationServices';
import PropTypes from 'prop-types';
import {withNavigation} from 'react-navigation';
import R from 'res/R';
import ScaleText from 'components/TextScale';

const HeaderDefault = ({
  onPressLeft,
  onPressRight,
  navigation,
  valueRight,
  iconRight,
  valueLeft,
  iconLeft,
  title,
  styleHeader,
  isBack,
}) => {
  return (
    <View style={[styles.containerHeader, styleHeader]}>
      {navigation.isFirstRouteInParent() ? (
        <View style={styles.isEmpty} />
      ) : (
        <ButtonBase
          onPress={onPressLeft}
          icon={iconLeft ? iconLeft : R.images.icons.ic_back}
          value={valueLeft}
        />
      )}
      <Text style={styles.txtNameHeader}>{title || ''}</Text>
      {onPressRight ? (
        <ButtonBase
          value={valueRight}
          icon={iconRight}
          onPress={onPressRight}
        />
      ) : (
        <View  style={styles.isEmpty}/>
      )}
    </View>
  );
};
HeaderDefault.defaultProps = {
  onPressLeft: () => NavigationServices.pop(),
};
export default withNavigation(memo(HeaderDefault));

const styles = StyleSheet.create({
  isEmpty: {
    width: 35,
  },
  containerHeader: {
    backgroundColor: R.colors.blue,
    minHeight: Platform.select({
      android: StatusBar.currentHeight + 55,
      ios: 90,
    }),
    alignItems: 'center',
    paddingTop: 25,
    flexDirection: 'row',
    elevation: 3,
    justifyContent: 'space-between',
    shadowColor: 'black',
    marginBottom: 10,
    shadowOffset: {width: 0, height: 3},
  },
  txtNameHeader: {
    flex: 1,
    color: R.colors.white,
    paddingHorizontal: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: PixelRatio.get() > 2 ? 18 : 16,
  },
});
