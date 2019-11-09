import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import apis from 'configs/apis';
import { updateCountNoti } from 'middlewares/actions/notification/actionNotification';
import R from 'res/R';
import { connect } from 'react-redux';
import moment from 'moment';
import 'moment/locale/vi'
import firebase from 'react-native-firebase';
import utils from 'configs/utils';
import LoginRequire from 'screens/AccountScreen/LoginRequire';
class NotificationScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isLoading: true,
      count: ''
    };
  }

  componentDidMount() {
    this.notificationListener = firebase.notifications().onNotification(this.getData);
    this.getData()
  }
  componentWillUnmount() {
    try {
      this.notificationListener();
    } catch (error) {

    }
  }

  getData = async () => {
    let res = await apis.fetch(apis.PATH.NOTIFICATION)
    this.setState({ isLoading: false })
    if (res && res.code == 200) {
      this.setState({ data: res.data, count: res.count })
      this.props.dispatch(updateCountNoti(res.count))
    }
  }
  renderTitle = (item) => {
    switch (item.type) {
      case 1: return 'Lịch khám'
      case 2: return 'Dấu hiệu bất thường'
      case 3: return 'Lời dặn'
      case 4: return 'Tư vấn'
      case 5:
      case 6: return 'Thuốc'
      default: return 'Thông báo'
    }
  }
  formatDate = (item) => {
    return moment(item.create_at).fromNow()
  }
  watchNoti = (item, index) => async () => {
    let res = await apis.post(apis.PATH.UPDATE_NOTIFICATION, { id: item._id }, true)
    if (res && res.code == 200) {
      let data = [...this.state.data]
      data[index].watched = 1
      this.setState({ data })
      this.props.dispatch(updateCountNoti(this.state.count - 1))
    }

  }
  renderItem = ({ item, index }) => {
    const icon = item.image ? { uri: item.image } : R.images.icons.ic_notification
    return (
      <TouchableOpacity
        onPress={this.watchNoti(item, index)}
        style={[styles.containerItem, { backgroundColor: item.watched == 0 ? R.colors.secondColor : R.colors.white }]}>
        <Image source={icon} style={[styles.imageNoti, { resizeMode: item.image ? 'cover' : 'contain' }]} />
        <View style={styles.containerText}>
          <Text style={styles.txtTitle}>{this.renderTitle(item)}</Text>
          <Text style={styles.txtContent} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.txtTime}>{this.formatDate(item)}</Text>

        </View>
      </TouchableOpacity>
    )
  }
  keyExtractor = (item, index) => `${item._id || index}`
  listEmpty = () => !this.state.isLoading && <Text style={{
    paddingTop: 30,
    textAlign: 'center',
    fontFamily: R.fonts.Bold,
    fontSize: 19
  }}>Không có dữ liệu</Text>
  render() {
    const { data } = this.state
    if (!utils.database.token) {
      return <LoginRequire />
    }
    return (
      <View style={{
        flex: 1,
        backgroundColor: '#eee'
      }}>
        <View style={{
          backgroundColor: R.colors.defaultColor,
          minHeight: 60,
          justifyContent: 'center',
          // paddingLeft:30
          alignItems: 'center'
        }}>
          <Text style={{
            color: R.colors.white,
            fontFamily: R.fonts.Heavy,
            fontSize: 17
          }}>Thông báo</Text>
        </View>
        <FlatList
          data={data}
          renderItem={this.renderItem}
          onRefresh={this.getData}
          refreshing={false}
          keyExtractor={this.keyExtractor}
          ListEmptyComponent={this.listEmpty}
        />
      </View>
    );
  }
}

export default connect()(NotificationScreen);


const styles = StyleSheet.create({
  txtContent: {
    flexWrap: 'wrap',
    width: '90%'
  },
  txtTime: {
    paddingTop: 3,
    fontFamily: R.fonts.Italic,
    color: R.colors.gray
  },
  txtTitle: {
    fontFamily: R.fonts.Bold,
    fontSize: 15,
    paddingBottom: 7,
  },
  containerText: {
    flexWrap: 'wrap',
    paddingLeft: 15
  },
  imageNoti: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  containerItem: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5
  },
})