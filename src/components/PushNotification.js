import firebase from 'react-native-firebase';
import React from 'react'
import { AppState, View, Platform } from 'react-native'
// import LaunchApplication from 'react-native-launch-application';
import utils from 'configs/utils';
import apis from 'configs/apis';
import NavigationServices from 'routes/NavigationServices';
import screenName from 'configs/screenName';
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
                apis.post(apis.PATH.ADD_TOKEN_FCM, { token }, true).then(res => { })
                    .catch(err => { })
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
        // RNCallKeepManager.displayIncommingCall(0)
        console.log('onNotificationOpened: ', notificationOpen);
        try {
            firebase.notifications().removeDeliveredNotification(notificationOpen.notification.notificationId);
            if (notificationOpen && notificationOpen.notification && notificationOpen.notification.data) {
                var data = notificationOpen.notification.data;
                const type = notificationOpen.notification.data.type
                console.log('type: ', type);
                switch (type) {
                    //  1 thông báo trước 1 ngày đến lịch khám 
                    case '1':
                        break;
                    //  2 thông báo đã gửi báo cáo dấu hiệu, nhân viên y tế sẽ lien lạc với bạn sớm
                    case '2':
                        NavigationServices.navigate(screenName.NotificationScreen)
                        break;
                    //  3 Thông báo có lời dặn mới của bác sĩ
                    case '3':
                        break;
                    //  4 Thông báo bác sĩ trả lời chat tư vấn
                    case '4':
                        break;
                    case '5':
                        //  5  thông báo đơn thuốc đã được nhập và tìm thấy địa chỉ bán, ấn vào để đặt mua
                        break;
                    case '6':
                        //  6 Thông báo đặt mua thành công, đơn hàng sẽ đến trong ít phut
                        break;
                    default:
                        break;
                }
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
                console.log('notificationOpen.notification.notificationId: ', notificationOpen.notification.notificationId);
                if (notificationOpen && notificationOpen.notification && notificationOpen.notification.data) {
                    var data = notificationOpen.notification.data;
                    const type = notificationOpen.notification.data.type
                    console.log('type: ', type);
                    switch (type) {
                        //  1 thông báo trước 1 ngày đến lịch khám 
                        case '1':
                            NavigationServices.navigate(screenName.NotificationScreen)
                            break;
                        //  2 thông báo đã gửi báo cáo dấu hiệu, nhân viên y tế sẽ lien lạc với bạn sớm
                        case '2':
                            NavigationServices.navigate(screenName.NotificationScreen)
                            break;
                        //  3 Thông báo có lời dặn mới của bác sĩ
                        case '3':
                            NavigationServices.navigate(screenName.NotificationScreen)
                            break;
                        //  4 Thông báo bác sĩ trả lời chat tư vấn
                        case '4':
                            NavigationServices.navigate(screenName.NotificationScreen)
                            break;
                        //  5  thông báo đơn thuốc đã được nhập và tìm thấy địa chỉ bán, ấn vào để đặt mua
                        case '5':
                            NavigationServices.navigate(screenName.NotificationScreen)
                            break;
                        //  6 Thông báo đặt mua thành công, đơn hàng sẽ đến trong ít phut
                        case '6':
                            NavigationServices.navigate(screenName.NotificationScreen)
                            break;
                        default:
                            break;
                    }
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