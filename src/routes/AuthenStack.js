import { createAppContainer } from 'react-navigation'
import { createStackNavigator, createPointerEventsContainer } from 'react-navigation-stack'
import screenName from 'configs/screenName'
import { fromLeft, zoomIn, zoomOut, fadeIn, fadeOut, flipX, flipY, fromBottom, fromRight, fromTop, } from 'react-navigation-transitions';
import LoginScreen from 'screens/auth/LoginScreen';
const handleCustomTransition = ({ scenes }) => {
    const prevScene = scenes[scenes.length - 2];
    const nextScene = scenes[scenes.length - 1];
    // Custom transitions go there
    if (prevScene
        && prevScene.route.routeName === screenName.LOGIN
        && nextScene.route.routeName === screenName.RegisterScreen) {
        return fromTop();
    } else if (prevScene
        && prevScene.route.routeName === screenName.LoginScreen
        && nextScene.route.routeName === screenName.ForgotPasswordScreen) {
        return fromRight();
    }
    return fromLeft();
}
const authenStack = createStackNavigator({
    [screenName.LOGIN]: { screen: LoginScreen },
}, {
    initialRouteName: screenName.LOGIN,
    headerMode: 'none',
    transitionConfig: (transitionProps) => handleCustomTransition(transitionProps)
})

export default authenStack