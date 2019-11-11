import firebase from 'react-native-firebase';
import React from 'react'
import { AppState, View } from 'react-native'
// import LaunchApplication from 'react-native-launch-application';
import RNCallKeepManager from './RNCallKeepManager'
import utils from 'configs/utils';
export default async (message) => {
    // handle your message
    RNCallKeepManager.displayIncommingCall(0)
    console.log('react-native-firebase background message handler run', message)
    console.log('AppState', AppState.currentState)
    let notification = new firebase.notifications.Notification()
        .setTitle('Thông báo từ hồng hạc')
        .setBody('hihi')
        .setData(message.data)
        .setSound('default')
        .android.setPriority(firebase.notifications.Android.Priority.High)
        .android.setAutoCancel(true)
        .android.setChannelId('parsa-notification-channel');

    firebase.notifications().displayNotification(notification)
    if (AppState.currentState != 'active') {
        console.log('display callkeep from background')
        RNCallKeepManager.displayIncommingCall(0)
        // sendEventDidDisplayIncommingCall(0, message.data.videoCallId)
    } else {
        console.log('display callkeep even app is not running')
        RNCallKeepManager.displayIncommingCall(0)
        // sendEventDidDisplayIncommingCall(message.data.doctor_id, message.data.videoCallId)
        // setTimeout(() => {
        //     LaunchApplication.open('com.baseappreactnative')
        // }, 500)
    }



    return Promise.resolve();
}