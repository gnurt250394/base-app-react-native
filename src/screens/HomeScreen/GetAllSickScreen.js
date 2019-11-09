import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Container from 'library/Container';
import R from 'res/R';
import NavigationServices from 'routes/NavigationServices';
import screenName from 'configs/screenName';
import apis from 'configs/apis';

class GetAllSickScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      type: this.props.navigation.getParam('type')
    };
  }
  onNext = (item) => () => {
    if (this.state.type == "showMore") {
      NavigationServices.navigate(screenName.LoginScreen, {
        nextScreen: screenName.TestTodayScreen,
        item
      })
    } else if (this.state.type == 'today') {
      NavigationServices.navigate(screenName.TestTodayScreen, {
        item,
        value: this.props.navigation.getParam('value')
      })
    } else {
      NavigationServices.navigate(screenName.TestScreen, {
        item
      })
    }

  }
  componentDidMount() {
    this.getData()
  }
  getData = async () => {
    let res = await apis.fetch(apis.PATH.SICK)
    if (res && res.code == 200) {
      this.setState({ data: res.data })
    }
  }
  renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={this.onNext(item)}
        style={styles.containerItem}
      >
        <Text>{item.name}</Text>
      </TouchableOpacity>
    )
  }
  keyExtractor = (item, index) => `${item._id || index}`
  render() {
    const { data } = this.state
    return (
      <Container>
        <FlatList
          data={data}
          renderItem={this.renderItem}
          keyExtractor={this.keyExtractor}
        />
      </Container>
    );
  }
}

export default GetAllSickScreen;


const styles = StyleSheet.create({
  containerItem: {
    paddingTop: 15,
    borderBottomColor: R.colors.gray,
    borderBottomWidth: 1,
    paddingBottom: 15,
    alignItems: 'center'
  },
})