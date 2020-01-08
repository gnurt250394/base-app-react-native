import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    TouchableHighlight,
    View,
    TextInput,
    Platform,
    value,
    FlatList,
    TouchableOpacity,
    Image
} from 'react-native';
import ListView from "deprecated-react-native-listview";
import io from 'socket.io-client';

const socket = io.connect('https://react-native-webrtc.herokuapp.com', { transports: ['websocket'] });
// const socket = io.connect(apis.BASE_SOCKET, { transports: ['websocket'] });

import {
    RTCPeerConnection,
    RTCIceCandidate,
    RTCSessionDescription,
    RTCView,
    MediaStream,
    MediaStreamTrack,
    mediaDevices
} from 'react-native-webrtc';
import apis from 'configs/apis';
import { height, width } from 'configs/utils';
import R from 'res/R';
// const configuration = {
//     iceServers: [
//         { urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'] },
//         // {
//         //   'urls': 'turn:45.252.248.114:3478?transport=udp',
//         //   'credential': 'B0h3m14nrh4ps0dy',
//         //   'username': 'vskin8899'
//         // },
//         // {
//         //   urls: 'turn:45.252.248.114:3478?transport=tcp',
//         //   credential: 'B0h3m14nrh4ps0dy',
//         //   username: 'vskin8899'
//         // }
//     ]
// };
const configuration = { "iceServers": [{ "url": "stun:stun.l.google.com:19302" }] };
export default class VideoCall extends Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => true });
        this.state = {
            info: 'Initializing',
            status: 'init',
            roomID: '',
            isFront: true,
            selfViewSrc: null,
            remoteList: {},
            textRoomConnected: false,
            textRoomData: [],
            textRoomValue: '',
        }
        this.localStream
        this.pcPeers = {}
        socket.on('exchange', (data) => {
            this.exchange(data);
        });
        socket.on('leave', (socketId) => {
            this.leave(socketId);
        });

        socket.on('connect', (data) => {
            console.log('data: ', data);
            this.getLocalStream(true, (stream) => {
                console.log('stream: ', stream);
                this.localStream = stream;
                this.setState({ selfViewSrc: stream.toURL() });
                this.setState({ status: 'ready', info: 'Please enter or create room ID' });
            });
        });
    }
    getLocalStream = (isFront, callback) => {
        let videoSourceId;
        // on android, you don't have to specify sourceId manually, just use facingMode
        // uncomment it if you want to specify
        if (Platform.OS === 'ios') {
            mediaDevices.enumerateDevices().then(sourceInfos => {
                for (const i = 0; i < sourceInfos.length; i++) {
                    const sourceInfo = sourceInfos[i];
                    if (sourceInfo.kind == "videoinput" && sourceInfo.facing == (isFront ? "front" : "back")) {

                        videoSourceId = sourceInfo.id;
                    }
                }
            });
        }
        mediaDevices.getUserMedia({

            audio: true,
            video: {
                mandatory: {
                    minWidth: 640, // Provide your own width, height and frame rate here
                    minHeight: 360,
                    minFrameRate: 30,
                },
                facingMode: (isFront ? "user" : "environment"),
                optional: (videoSourceId ? [{ sourceId: videoSourceId }] : []),

            }

        }).then((stream) => {
            console.log('getUserMedia success', stream);
            callback(stream);
        }, this.logError)

    }

    join = (roomID) => {
        socket.emit('join', roomID, (socketIds) => {
            console.log('socketIds: ', socketIds);
            for (const i in socketIds) {
                const socketId = socketIds[i];
                console.log('join' + socketId + "ravi");
                this.createPC(socketId, true);
            }
        });
    }

    createPC = (socketId, isOffer) => {
        const pc = new RTCPeerConnection(configuration);
        console.log('pc: ', pc);
        this.pcPeers[socketId] = pc;

        pc.onicecandidate = (event) => {
            // console.log('onicecandidate', event.candidate);
            if (event.candidate) {
                socket.emit('exchange', { 'to': socketId, 'candidate': event.candidate });
            }
        };

        const createOffer = () => {
            pc.createOffer().then((desc) => {
                console.log('createOffer', desc);
                pc.setLocalDescription(desc).then(() => {
                    console.log('setLocalDescription', pc.localDescription);
                    socket.emit('exchange', { 'to': socketId, 'sdp': pc.localDescription });
                }, this.logError);
            }, this.logError);
        }

        pc.onnegotiationneeded = () => {
            console.log('onnegotiationneeded')
            if (isOffer) {
                createOffer()
            }
        }

        pc.oniceconnectionstatechange = (event) => {
            console.log('oniceconnectionstatechange', event.target.iceConnectionState)
            if (event.target.iceConnectionState === 'completed') {
                setTimeout(() => {
                    this.getStats()
                }, 1000)
            }
            if (event.target.iceConnectionState === 'connected') {
                createDataChannel();
            }
        };
        pc.onsignalingstatechange = (event) => {
            console.log('onsignalingstatechange', event.target.signalingState);
        };

        pc.onaddstream = (event) => {
            console.log('onaddstream', event.stream);
            this.setState({ info: 'One peer join!' });

            const remoteList = this.state.remoteList;
            remoteList[socketId] = event.stream.toURL();
            this.setState({ remoteList: remoteList });
        };
        pc.onremovestream = (event) => {
            console.log('onremovestream', event.stream);
        };

        console.log('localStream: ', this.localStream);
        pc.addStream(this.localStream);
        const createDataChannel = () => {
            if (pc.textDataChannel) {
                return;
            }
            const dataChannel = pc.createDataChannel("text");

            dataChannel.onerror = (error) => {
                console.log("dataChannel.onerror", error);
            };

            dataChannel.onmessage = (event) => {
                console.log("dataChannel.onmessage:", event.data);
                this.receiveTextData({ user: socketId, message: event.data });
            };

            dataChannel.onopen = () => {
                console.log('dataChannel.onopen');
                this.setState({ textRoomConnected: true });
            };

            dataChannel.onclose = () => {
                console.log("dataChannel.onclose");
            };

            pc.textDataChannel = dataChannel;
        }
        return pc;
    }

    exchange = (data) => {
        console.log('data: ', data);
        const fromId = data.from;
        let pc;
        if (fromId in this.pcPeers) {
            pc = this.pcPeers[fromId];
        } else {
            pc = this.createPC(fromId, false);
        }

        if (data.sdp) {
            console.log('exchange sdp', data);
            pc.setRemoteDescription(new RTCSessionDescription(data.sdp)).then(() => {
                if (pc.remoteDescription.type == "offer")
                    pc.createAnswer().then((desc) => {
                        console.log('createAnswer', desc);
                        pc.setLocalDescription(desc).then(() => {
                            console.log('setLocalDescription', pc.localDescription);
                            socket.emit('exchange', { 'to': fromId, 'sdp': pc.localDescription });
                        }, this.logError);
                    }, this.logError);
            }, this.logError);
        } else {
            console.log('exchange candidate', data);
            pc.addIceCandidate(new RTCIceCandidate(data.candidate));
        }
    }

    leave = (socketId) => {
        console.log('leave', socketId);
        const pc = this.pcPeers[socketId];
        console.log('pc: ', pc);
        pc.close();
        delete this.pcPeers[socketId];
        const remoteList = this.state.remoteList;
        delete remoteList[socketId]
        this.setState({ remoteList: remoteList });
        this.setState({ info: 'One peer leave!' });
    }

    logError = (error) => {
        console.log("logError", error);
    }

    mapHash = (hash, func) => {
        const array = [];
        for (const key in hash) {
            console.log("ravi -- " + hash[key])
            const obj = hash[key];
            array.push(func(obj, key));
        }
        return array;
    }

    getStats = () => {
        const pc = this.pcPeers[Object.keys(this.pcPeers)[0]];
        if (pc.getRemoteStreams()[0] && pc.getRemoteStreams()[0].getAudioTracks()[0]) {
            const track = pc.getRemoteStreams()[0].getAudioTracks()[0];
            console.log('track', track);
            pc.getStats(track).then((report) => {
                console.log('getStats report', report);
            }, this.logError);
        }
    }
    _press(event) {

        this.refs.roomID.blur(event)
        this.setState({ status: 'connect', info: 'Connecting' }, () => {
            this.join(event)
        })

    }
    _switchVideoType() {

        const isFront = !this.state.isFront;

        this.setState({ isFront });
        // console.log(this.state.isFront)
        this.getLocalStream(isFront, (stream) => {
            if (this.localStream) {
                for (const id in this.pcPeers) {
                    const pc = this.pcPeers[id];
                    pc && pc.removeStream(this.localStream);
                }
                this.localStream.release();
            }
            this.localStream = stream;
            this.setState({ selfViewSrc: stream.toURL() });

            for (const id in this.pcPeers) {
                const pc = this.pcPeers[id];
                pc && pc.addStream(this.localStream);
            }
        });
    }
    receiveTextData = (data) => {
        const textRoomData = this.state.textRoomData.slice();
        textRoomData.push(data);
        this.setState({ textRoomData, textRoomValue: '' });
    }
    _textRoomPress() {
        if (!this.state.textRoomValue) {
            return
        }
        const textRoomData = this.state.textRoomData.slice();
        textRoomData.push({ user: 'Me', message: this.state.textRoomValue });
        for (const key in this.pcPeers) {
            const pc = this.pcPeers[key];
            pc.textDataChannel.send(this.state.textRoomValue);
        }
        this.setState({ textRoomData, textRoomValue: '' });
    }
    _renderTextRoom() {
        return (
            <View style={styles.listViewContainer}>
                <ListView
                    dataSource={this.ds.cloneWithRows(this.state.textRoomData)}
                    renderRow={rowData => <Text>{`${rowData.user}: ${rowData.message}`}</Text>}
                />
                <TextInput
                    style={styles.sendMessageText}
                    onChangeText={value => this.setState({ textRoomValue: value })}
                    value={this.state.textRoomValue}
                />
                <TouchableHighlight
                    onPress={this._textRoomPress.bind(this, this.state.textRoomValue)}>
                    <Text>Send</Text>
                </TouchableHighlight>
            </View>
        );
    }
    closeVideoCall = () => {
        const pc = this.pcPeers[socketId];
        if (pc) {

            pc.close();
            delete this.pcPeers[socketId];
            const remoteList = this.state.remoteList;
            delete remoteList[socketId]
            this.setState({ remoteList: remoteList });
            this.setState({ info: 'One peer leave!' });
        }
    }
    render() {
        let data = [this.state.selfViewSrc, this.state.selfViewSrc, this.state.selfViewSrc, this.state.selfViewSrc]
        return (
            <View style={styles.container}>
                {/* <Text style={styles.welcome}>
                    {this.state.info}
                </Text> */}

                {this.state.status == 'ready' ?
                    (<View style={{
                        alignItems: 'center',
                        width: 200,
                        justifyContent: 'center',
                        padding: 10,
                    }}>
                        <TextInput
                            ref='roomID'
                            autoCorrect={false}
                            style={styles.textInputRoomID}
                            onChangeText={(text) => this.setState({ roomID: text })}
                            value={this.state.roomID}
                        />
                        <TouchableHighlight
                            style={{
                                backgroundColor: R.colors.defaultColor,
                                paddingVertical: 10,
                                paddingHorizontal: 10,
                                borderRadius: 5,
                                marginTop: 10
                            }}
                            onPress={this._press.bind(this, this.state.roomID)}>
                            <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Enter room</Text>
                        </TouchableHighlight>
                    </View>) : null
                }



                {
                    this.mapHash(this.state.remoteList, (remote, index) => {
                        console.log("remote" + remote)
                        return <RTCView key={index} streamURL={remote} objectFit="cover" style={styles.remoteView} />
                    })
                }
                {/* <View style={{ flex: 1 }}>
                    <FlatList
                        data={Object.keys(this.state.remoteList)}
                        renderItem={({ item, index }) => {
                            return (
                                <RTCView streamURL={item} objectFit="cover" style={{
                                    width: (data.length > 1 ? width / 2 : width),
                                    height: height / (data.length % 2 == 0 ? data.length : data.length - 1)
                                }} />
                            )
                        }}
                        numColumns={2}
                        keyExtractor={(item, index) => `${index}`}
                    />
                </View> */}
                <View style={{
                    position: 'absolute',
                    height: height / 4,
                    width: width / 3 + 20,
                    top: 0,
                    right: 0,
                    zIndex: 1000
                }}>

                    <RTCView streamURL={this.state.selfViewSrc} objectFit="cover" style={styles.selfView} />
                    <TouchableOpacity
                        onPress={this.closeVideoCall}
                        style={styles.buttonClose}>
                        <Image source={R.images.icons.ic_close} style={styles.imageClose} />
                    </TouchableOpacity>
                    <View style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                    }}>
                        <TouchableHighlight
                            style={styles.switchCamera}
                            onPress={this._switchVideoType.bind(this)}>
                            <Image source={R.images.icons.switch_camera} style={{
                                height: 30,
                                width: 30,
                                resizeMode: 'contain',
                                tintColor: 'green'
                            }} />
                        </TouchableHighlight>
                    </View>
                </View>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    buttonClose: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        flex: 1,
        position: 'absolute',
        bottom: 0,
        paddingVertical: 10
    },
    imageClose: {
        height: 30,
        width: 30,
        resizeMode: 'contain'
    },
    selfView: {
        flex: 1,
    },
    remoteView: {
        width: width,
        height: height,

    },
    container: {
        flex: 1,
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    listViewContainer: {
        height: 150,
    },
    textInputRoomID: {
        width: '100%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1
    },
    switchCamera: {
        paddingBottom: 10,
        paddingTop: 5,
        paddingHorizontal: 10
    },
    sendMessageText: {
        width: 200,
        height: 30,
        borderColor: 'gray',
        borderWidth: 1
    },
});