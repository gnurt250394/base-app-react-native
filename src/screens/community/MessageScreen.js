import React, { Component } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Container from 'library/Container';
import R from 'res/R';
import NavigationServices from 'routes/NavigationServices';
import screenName from 'configs/screenName';
import { getlistMessage } from 'configs/apis/getListMessage';
import io from 'socket.io-client'
import apis, { BASE_SOCKET } from 'configs/apis';
import HeaderDefault from 'components/HeaderDefault';
import HeaderMessage from './HeaderMessage';
import ItemMessage from './ItemMessage';
class MessageScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: this.props.navigation.getParam('item') || {},
      data: [],
      page: 1,
      message: '',
    };

  }
  componentDidMount = () => {
    this.socket = io.connect(BASE_SOCKET)
    this.socket.on('send_message', data => {
      console.log('data: 1', data);

    })
    this.socket.on('message', data => {
      console.log('data: ', data);

    })
    this.getData()
  };
  getData = async () => {
    const { item, page } = this.state
    let res = await getlistMessage(item.id, page)
  }
  videoCall = () => {
    const { item } = this.state
    console.log('item: ', item);
    NavigationServices.navigate(screenName.VideoCallScreen, {
      data: item
    })
  }
  _renderItem = ({ item, index }) => {
    return (
      <ItemMessage item={item} />
    )
  }
  onChangeText = (message) => this.setState({ message })
  keyExtractor = (item, index) => `${item.id || index}`

  onSend = async () => {
    const { message, item } = this.state
    const reciver_id = item._id
    item.message = message
    this.socket.emit('send_message', item)
    let res = await apis.post(apis.PATH.CHATS, { message, reciver_id },true)

  }
  render() {
    const { item, data } = this.state
    return (

      <View style={{
        backgroundColor: R.colors.white,
        flex: 1
      }}>
        <HeaderMessage
          title={item.name}
          iconRight={R.images.icons.ic_facetime}
          onPressRight={this.videoCall}

        />
        <FlatList
          data={data}
          renderItem={this._renderItem}
          keyExtractor={this.keyExtractor}
        />
        <View style={styles.containerSend}>
          <TextInput
            style={styles.inputSend}
            onChangeText={this.onChangeText}
            placeholder="Nhập tin nhắn"
          />
          <TouchableOpacity
            onPress={this.onSend}
            style={styles.buttonSend}>
            <Text>Gửi</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default MessageScreen;


const styles = StyleSheet.create({
  buttonSend: {
    backgroundColor: R.colors.secondColor,
    height: 40,
    borderRadius: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10
  },
  inputSend: {
    height: 40,
    flex: 1,
    borderColor: R.colors.gray,
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10
  },
  containerSend: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingTop: 5,
    borderTopWidth: 1,
    borderColor: R.colors.black
  },
})