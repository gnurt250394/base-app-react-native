import firebase from 'react-native-firebase';
import React from 'react'
import { AppState, View, Platform } from 'react-native'
import LaunchApplication from 'react-native-launch-application';
import RNCallKeepManager from './RNCallKeepManager'
import utils from 'configs/utils';

function sendEventDidDisplayIncommingCall(doctorId, videoCallId) {
    fetch(
        AppConfig.API_SERVER + '/video-call-event',
        {
            headers: {
                'content-type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
                doctorId,
                videoCallId
            })
        }
    )
}
// export default async (message) => {
//     // handle your message
//     console.log('react-native-firebase background message handler run', message)
//     console.log('AppState', AppState.currentState)

//     if (message.data && message.data.notification_message) {
//         let notification = new firebase.notifications.Notification()
//             .setTitle('Thông báo từ Parsa')
//             .setBody(message.data.notification_message)
//             .setData(message.data)
//             .setSound('default')
//             .android.setPriority(firebase.notifications.Android.Priority.High)
//             .android.setAutoCancel(true)
//             .android.setChannelId('parsa-notification-channel');

//         firebase.notifications().displayNotification(notification)
//     }

//     if (message.data.type == 5 && message.data.doctor_id) {
//         let notificationText = 'Cuộc gọi Video Call từ Bác sĩ'
//         let shouldDisplayIncommingCall = true
//         if (message.data.created_at) {
//             if (message.data.created_at < (Date.now() - 2 * 60 * 1000)) {
//                 shouldDisplayIncommingCall = false
//             }
//         }

//         if (!shouldDisplayIncommingCall)
//             notificationText = 'Bạn đã bỏ lỡ cuộc gọi video call từ Bác sĩ'

//         let notification = new firebase.notifications.Notification()
//             .setTitle('Thông báo từ Parsa')
//             .setBody(notificationText)
//             .setData(message.data)
//             .setSound('default')
//             .android.setPriority(firebase.notifications.Android.Priority.High)
//             .android.setAutoCancel(true)
//             .android.setChannelId('parsa-notification-channel');

//         firebase.notifications().displayNotification(notification)

//         if (shouldDisplayIncommingCall) {
//             if (AppState.currentState != 'active') {
//                 console.log('display callkeep from background')
//                 RNCallKeepManager.displayIncommingCall(message.data.doctor_id)
//                 sendEventDidDisplayIncommingCall(message.data.doctor_id, message.data.videoCallId)
//             } else {
//                 console.log('display callkeep even app is not running')
//                 RNCallKeepManager.displayIncommingCall(message.data.doctor_id)
//                 sendEventDidDisplayIncommingCall(message.data.doctor_id, message.data.videoCallId)
//                 setTimeout(() => {
//                     LaunchApplication.open('vn.com.parsa')
//                 }, 500)
//             }
//         }
//     }

//     return Promise.resolve();
// }
class PushNotification extends React.Component {

    showBroadcast() {
        const notification = new firebase.notifications.Notification()
            .setNotificationId(utils.guid())
            .setBody('hong hac')
            .setTitle('hong hac')
            .android.setChannelId("honghac-channel")
            .android.setSmallIcon("ic_launcher")
            .setSound("default")

        firebase.notifications().displayNotification(notification)
    }


    componentDidMount() {
        // Build a channel
        const channel = new firebase.notifications.Android.Channel('honghac-channel', 'honghac-channel', firebase.notifications.Android.Importance.Max).setDescription('Hồng hạc Notification channel');
        // Create the channel
        firebase.notifications().android.createChannel(channel);
        // showBroadcast = this.showBroadcast();
        firebase.messaging().hasPermission()
            .then(enabled => {
                console.log('enabled: ', enabled);
                if (!enabled) {
                    firebase.messaging().requestPermission()
                        .then(() => {
                            // User has authorised  
                        })
                        .catch(error => {
                            // User has rejected permissions  
                        });
                }
            });

        firebase.messaging().getToken()
            .then((token) => {
                console.log('Device FCM Token: ', token);
                utils.database.tokenFCM = token;
                firebase.messaging().subscribeToTopic("honghac_test");
            });


        this.notificationListener = firebase.notifications().onNotification(this.onNotification.bind(this));
        this.notificationOpenedListener = firebase.notifications().onNotificationOpened(this.onNotificationOpened.bind(this));
        this.notificationInitialListener = firebase.notifications().getInitialNotification().then(this.getInitialNotification.bind(this));
    }
    onNotification(notification) {
        console.log('onNotification: ', notification);
        console.log('onNotification: ', notification.data);

        if (Platform.OS === 'android') {

            const localNotification = new firebase.notifications.Notification({
                sound: 'default',
                show_in_foreground: true,
            })
                .setNotificationId(notification.notificationId)
                .setTitle(notification.title)
                .setSubtitle(notification.subtitle)
                .setBody(notification.body)
                .setData(notification.data)
                .android.setChannelId('honghac-channel') // e.g. the id you chose above
                .android.setSmallIcon('ic_launcher') // create this icon in Android Studio
                .android.setColor('#000000') // you can set a color here
                .android.setPriority(firebase.notifications.Android.Priority.High);

            firebase.notifications()
                .displayNotification(localNotification)
                .catch(err => console.error(err));

        } else if (Platform.OS === 'ios') {

            const localNotification = new firebase.notifications.Notification()
                .setNotificationId(notification.notificationId)
                .setTitle(notification.title)
                .setSubtitle(notification.subtitle)
                .setBody(notification.body)
                .setData(notification.data)
                .ios.setBadge(notification.ios.badge);

            firebase.notifications()
                .displayNotification(localNotification)
                .catch(err => console.error(err));

        }

    }
    onNotificationOpened(notificationOpen) {
        RNCallKeepManager.displayIncommingCall(0)
        console.log('onNotificationOpened: ', notificationOpen);
        try {
            firebase.notifications().removeDeliveredNotification(notificationOpen.notification.notificationId);
            if (notificationOpen && notificationOpen.notification && notificationOpen.notification.data) {
                var data = notificationOpen.notification.data;

            }
        } catch (error) {
            console.log(error);
        }
    }



    getInitialNotification(notificationOpen) {
        console.log('getInitialNotification: ', notificationOpen);
        if (notificationOpen) {
            try {
                firebase.notifications().removeDeliveredNotification(notificationOpen.notification.notificationId);
                if (notificationOpen && notificationOpen.notification && notificationOpen.notification.data) {
                    var data = notificationOpen.notification.data;
                    const type = Number(notificationOpen.notification.data.type)
                }
            } catch (error) {
                console.log(error);
            }
        }
    }
    componentWillUnmount() {
        try {
            this.notificationInitialListener();
            this.notificationListener();
            this.notificationOpenedListener();
        } catch (error) {

        }
    }

    render() {
        return <View>
        </View>;
    }
}

export default PushNotification