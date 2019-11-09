/*global socket*/

import React from 'react'
import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  MediaStreamTrack,
  mediaDevices
} from 'react-native-webrtc'
import io from 'socket.io-client'

import { View, Platform, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { NavigationEvents } from 'react-navigation'
import InCallManager from 'react-native-incall-manager';
import RNCallkit from 'react-native-callkit'
import RNCallKeep from 'react-native-callkeep'
import ApiConfig from 'configs/ApiConfig';
import R from 'res/R';
import { height, width } from 'configs/utils';
import { BASE_SOCKET } from 'configs/apis';
class NegativeButton extends React.Component {
  render() {
    let style
    if (Array.isArray(this.props.style)) {
      style = [styles.negativeButton, ...this.props.style]
    } else if (typeof this.props.style == 'object') {
      style = [styles.negativeButton, this.props.style]
    } else {
      style = [styles.negativeButton]
    }

    let text = this.props.text
    if (this.props.upperCase) {
      text = text.toUpperCase()
    }

    return (
      <TouchableOpacity style={style} onPress={this.props.onPress}>
        <Text style={styles.white}>{text}</Text>
      </TouchableOpacity>
    )
  }
}
export default class VideoCallScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      localStream: false,
      remoteStream: false
    }
    this.socket = io.connect(BASE_SOCKET)

  }

  getNavigationParam = () => {
    return this.props.navigation.getParam('data', {})
  }

  initOrRenewRtcPeerConnection = () => {
    const config = {
      iceServers: [
        { urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'] },
        // {
        //   'urls': 'turn:45.252.248.114:3478?transport=udp',
        //   'credential': 'B0h3m14nrh4ps0dy',
        //   'username': 'vskin8899'
        // },
        // {
        //   urls: 'turn:45.252.248.114:3478?transport=tcp',
        //   credential: 'B0h3m14nrh4ps0dy',
        //   username: 'vskin8899'
        // }
      ]
    }
    this.rtcPeerConnection = new RTCPeerConnection(config)

    this.rtcPeerConnection.onicecandidate = function (event) {
      console.log('event: ', event);
      console.log('onicecandidate fired')
      if (event.candidate) {
        let data = {
          toUserId: this.getNavigationParam().doctor_id,
          candidate: event.candidate,
        }
        console.log('send ice candidate to server')
        this.socket.emit(ApiConfig.SOCKET_EVENT_USER_WEBRTC_CANDIDATE, data)
      } else {
        console.log('sent all ices')
      }
    }

    this.rtcPeerConnection.onaddstream = e => {
      console.log('onaddstream get called', e.stream)
      // e.stream.getAudioTracks()[0].enabled = true
      this.setState({ remoteStream: e.stream }, () => {
        InCallManager.start({ media: 'audio' })
        InCallManager.setForceSpeakerphoneOn(true)
      })
    }
  }

  closeVideoCall = (activeMode) => () => {

    InCallManager.stop()

    if (this.state.localStream) {
      this.state.localStream.getTracks().forEach(track => track.stop())
    }
    if (this.state.remoteStream) {
      this.state.remoteStream.getTracks().forEach(track => track.stop())
    }
    if (this.rtcPeerConnection) {
      this.rtcPeerConnection.close()
    }
    this.setState({ isVideoCalling: false, remoteStream: false })

    console.log('navigation param', this.getNavigationParam())
    if (this.getNavigationParam().callUUID) {
      if (Platform.OS == 'ios') {
        RNCallkit.endCall(this.getNavigationParam().callUUID)
      }
      else {
        console.log('callkeep end call')
        RNCallKeep.endCall(this.getNavigationParam().callUUID)
      }
    }

    if (activeMode) {
      if (this.socket) {
        this.socket.emit(ApiConfig.SOCKET_EVENT_USER_WEBRTC_FINISH, {
          toUserId: this.getNavigationParam().doctor_id
        })
      }
    }

    this.props.navigation.goBack()
  }

  beginVideoCall = () => {
    let isFront = true;
    mediaDevices.enumerateDevices().then(sourceInfos => {
      console.log('sourceInfos: ', sourceInfos);
      let videoSourceId;
      for (let i = 0; i < sourceInfos.length; i++) {
        const sourceInfo = sourceInfos[i];
        if (sourceInfo.kind == "video" && sourceInfo.facing == (isFront ? "front" : "back")) {
          videoSourceId = sourceInfo.id;
        }
      }
      mediaDevices.getUserMedia({
        audio: true,
        video: {
          mandatory: {
            minWidth: 500, // Provide your own width, height and frame rate here
            minHeight: 300,
            minFrameRate: 30
          },
          facingMode: (isFront ? "user" : "environment"),
          optional: (videoSourceId ? [{ sourceId: videoSourceId }] : [])
        }
      })
        .then(stream => {
          console.log('stream: ', stream);
          // Got stream!
          stream.getAudioTracks()[0].enabled = true
          this.setState({
            localStream: stream
          })

          this.socket.emit(ApiConfig.SOCKET_EVENT_USER_WEBRTC_ACCEPT, {
            toUserId: this.getNavigationParam()._id
            
          })
          console.log('socket emitted accept')

          this.rtcPeerConnection.addStream(stream)
        })
        .catch(error => {
          console.log('error occurred', error.message)
        });
    });
  }

  screenWillFocus = () => {
    if (this.socket) {
      this.initOrRenewRtcPeerConnection()
      console.log('this.rtcPeerConnection.localDescription: ', this.rtcPeerConnection.localDescription);

      this.socket.on(ApiConfig.SOCKET_EVENT_USER_WEBRTC_OFFER, async data => {
        this.rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(data.sdp))
        await this.rtcPeerConnection.setLocalDescription(await this.rtcPeerConnection.createAnswer())
        this.socket.emit(ApiConfig.SOCKET_EVENT_USER_WEBRTC_ANSWER, {
          sdp: this.rtcPeerConnection.localDescription,
          toUserId: this.getNavigationParam().doctor_id
        })
      })

      this.socket.on(ApiConfig.SOCKET_EVENT_USER_WEBRTC_CANDIDATE, data => {
        console.log('data: ', data);
        if (typeof data.candidate != 'object') {
          try {
            data.candidate = JSON.parse(data.candidate)
          } catch (e) {
            console.log('error, can not parse candidate object')
          }
        }
        if (typeof data.candidate == 'object')

          this.rtcPeerConnection.addIceCandidate(
            new RTCIceCandidate(data.candidate)
          ).catch(e => {
            console.log('failure when adding candidate of partner', data.candidate, e.message)
          })
      })

      this.socket.on(ApiConfig.SOCKET_EVENT_USER_WEBRTC_FINISH, data => {
        // we should validate data first
        // code to validate()

        this.closeVideoCall()
      })

      this.beginVideoCall()
    }
  }

  screenWillBlur = () => {
    if (this.socket) {
      this.socket.off(ApiConfig.SOCKET_EVENT_USER_WEBRTC_OFFER)
      this.socket.off(ApiConfig.SOCKET_EVENT_USER_WEBRTC_CANDIDATE)
      this.socket.off(ApiConfig.SOCKET_EVENT_USER_WEBRTC_FINISH)
    }
  }

  render() {
    return (
      <View style={{ flex: 1, display: 'flex' }}>
        <NavigationEvents onWillBlur={this.screenWillBlur} onWillFocus={this.screenWillFocus} />
        <RTCView style={{ flex: 1 }}
          objectFit='cover'
          streamURL={this.state.remoteStream ? this.state.remoteStream.toURL() : null} />

        <View style={[styles.containerStream]}>
          <View style={styles.groupStream}>
            <RTCView style={{ flex: 1 }}
              objectFit='cover'
              streamURL={this.state.localStream ? this.state.localStream.toURL() : null} />
          </View>
          <TouchableOpacity
            onPress={this.closeVideoCall(true)}
            style={styles.buttonClose}>
            <Image source={R.images.icons.ic_close} style={styles.imageClose} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  groupStream: {
    width: width / 3,
    height: height / 4 - 30,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    display: 'flex',
    overflow: 'hidden'
  },
  containerStream: {
    height: height / 4,
    alignItems: 'center',
    position: 'absolute',
    width: width / 3,
    zIndex: 10,
    backgroundColor: 'white',
    top: 10,
    right: 0,
    borderRadius: 5
  },
  imageClose: {
    height: 20,
    width: 20,
    resizeMode: 'contain'
  },
  buttonClose: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    flex: 1
  },
  negativeButton: {
    backgroundColor: R.colors.defaultColor,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 30,
    paddingLeft: 30,
    borderRadius: 10
  },
  white: {
    color: 'white'
  },
});