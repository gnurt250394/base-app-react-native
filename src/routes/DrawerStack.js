import React from 'react'
import { createAppContainer } from 'react-navigation'
import { createStackNavigator, createPointerEventsContainer } from 'react-navigation-stack'
import { DrawerNavigatorItems, createDrawerNavigator } from 'react-navigation-drawer';
import screenName from 'configs/screenName'
import { fromLeft, zoomIn, zoomOut, fadeIn, fadeOut, flipX, flipY, fromBottom, fromRight, fromTop, } from 'react-navigation-transitions';
import HomeStack from './HomeStack';
import {  CustomDrawerContentComponent } from './customDrawer';
import R from 'res/R';


const drawerStack = createDrawerNavigator({
    [screenName.HomeStack]: { screen: HomeStack },
}, {
    edgeWidth:200,
    lazy:true,
    resetOnBlur:true,
    unmountInactiveRoutes:true,
    contentComponent: (props) => CustomDrawerContentComponent(props)
})

export default drawerStack