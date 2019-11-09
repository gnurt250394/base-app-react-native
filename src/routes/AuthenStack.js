import { createAppContainer } from 'react-navigation'
import { createStackNavigator, createPointerEventsContainer } from 'react-navigation-stack'
import screenName from 'configs/screenName'
import LoginScreen from 'screens/Login/LoginScreen'
import { fromLeft, zoomIn, zoomOut, fadeIn, fadeOut, flipX, flipY, fromBottom, fromRight, fromTop, } from 'react-navigation-transitions';
import RegisterScreen from 'screens/Register/RegisterScreen'
import ForgotPassScreen from 'screens/ForgotPassWord/ForgotPassScreen';
import ListHospitalScreen from 'screens/Register/ListHospitalScreen';
import InputPhone from 'screens/Register/InputPhone';
import OtpScreen from 'screens/Register/OtpScreen';
import TestScreen from 'screens/Test/TestScreen';
import TestResultScreen from 'screens/Test/TestResultScreen';
import ChangePassScreen from 'screens/AccountScreen/ChangePassScreen';
import GetAllSickScreen from 'screens/HomeScreen/GetAllSickScreen';
import ReportScreen from 'screens/Report/ReportScreen';
const handleCustomTransition = ({ scenes }) => {
    const prevScene = scenes[scenes.length - 2];
    const nextScene = scenes[scenes.length - 1];
    // Custom transitions go there
    if (prevScene
        && prevScene.route.routeName === screenName.LoginScreen
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
    [screenName.LoginScreen]: { screen: LoginScreen },
    [screenName.RegisterScreen]: { screen: RegisterScreen },
    [screenName.ForgotPasswordScreen]: { screen: ForgotPassScreen },
    [screenName.ListHospitalScreen]: { screen: ListHospitalScreen },
    [screenName.InputPhoneScreen]: { screen: InputPhone },
    [screenName.OtpScreen]: { screen: OtpScreen },
    [screenName.TestScreen]: { screen: TestScreen },
    [screenName.TestResultScreen]: { screen: TestResultScreen },
    [screenName.ChangePassScreen]: { screen: ChangePassScreen },
    [screenName.GetAllSickScreen]: { screen: GetAllSickScreen },
    [screenName.ReportScreen]: { screen: ReportScreen },
}, {
    initialRouteName: screenName.LoginScreen,
    headerMode: 'none',
    transitionConfig: (transitionProps) => handleCustomTransition(transitionProps)
})

export default authenStack