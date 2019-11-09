import { createStackNavigator } from 'react-navigation-stack'
import { createAppContainer } from 'react-navigation'
import screenName from 'configs/screenName'
import HomeScreen from 'screens/HomeScreen'
import { fromLeft, zoomIn, zoomOut, fadeIn, fadeOut, flipX, flipY, fromBottom, fromRight, fromTop, } from 'react-navigation-transitions';
import RegisterScreen from 'screens/Register/RegisterScreen';
import BottomTabStack from './BottomTabStack';
import ScheduleScreen from 'screens/Schedule/ScheduleScreen';
import FollowHealthScreen from 'screens/FollowHealth/FollowHealthScreen';
import DetailScheduleScreen from 'screens/Schedule/DetailScheduleScreen';
import NoteDoctorScreen from 'screens/FollowHealth/NoteDoctorScreen';
import DrugScreen from 'screens/drug/DrugScreen';
import BookingDrugScreen from 'screens/drug/BookingDrugScreen';
import ConfirmBookingScreen from 'screens/drug/ConfirmBookingScreen';
import MessageScreen from 'screens/community/MessageScreen';
import ListDoctorScreen from 'screens/community/ListDoctorScreen';
import CallVideoScreen from 'screens/community/CallVideoScreen';
import ReportScreen from 'screens/Report/ReportScreen';
import authenStack from './AuthenStack';
import ProfileScreen from 'screens/AccountScreen/ProfileScreen';
import TestTodayScreen from 'screens/HomeScreen/TestTodayScreen';
import MyDrugScreen from 'screens/drug/MyDrugScreen';
import ListHospitalScreen from 'screens/Register/ListHospitalScreen';
import HospitalScreen from 'screens/AccountScreen/HospitalScreen';
import CityScreen from 'screens/AccountScreen/CityScreen';
import DistrictScreen from 'screens/AccountScreen/DistrictScreen';
import CommunesScreen from 'screens/AccountScreen/CommunesScreen';
import ChangePassScreen from 'screens/AccountScreen/ChangePassScreen';
import DetailDrugScreen from 'screens/drug/DetailDrugScreen';
import TabDoctor from './TabDoctor';
import AdvisoryScreen from 'screens/community/AdvisoryScreen';
import GetAllSickScreen from 'screens/HomeScreen/GetAllSickScreen';
import LoginScreen from 'screens/Login/LoginScreen';
import ForgotPassScreen from 'screens/ForgotPassWord/ForgotPassScreen';
import InputPhone from 'screens/Register/InputPhone';
import OtpScreen from 'screens/Register/OtpScreen';
import TestScreen from 'screens/Test/TestScreen';
import TestResultScreen from 'screens/Test/TestResultScreen';
const handleCustomTransition = ({ scenes }) => {
    const prevScene = scenes[scenes.length - 2];
    const nextScene = scenes[scenes.length - 1];
    // Custom transitions go there
    if (prevScene
        && prevScene.route.routeName === screenName.HomeScreen
        && nextScene.route.routeName === screenName.HomeScreen) {
        return zoomIn();
    } else if (prevScene
        && prevScene.route.routeName === screenName.HomeScreen
        && nextScene.route.routeName === screenName.ScheduleScreen) {
        return fromBottom();
    }
    else if (prevScene
        && prevScene.route.routeName === screenName.BookingDrugScreen
        && nextScene.route.routeName === screenName.ConfirmBookingScreen) {
        return fromBottom();
    }
    return fromRight();
}
const homeStack = createStackNavigator({
    [screenName.HomeScreen]: { screen: BottomTabStack },
    [screenName.ScheduleScreen]: { screen: ScheduleScreen },
    [screenName.FollowHealthScreen]: { screen: FollowHealthScreen },
    [screenName.DetailScheduleScreen]: { screen: DetailScheduleScreen },
    [screenName.NoteDoctorScreen]: { screen: NoteDoctorScreen },
    [screenName.DrugScreen]: { screen: DrugScreen },
    [screenName.BookingDrugScreen]: { screen: BookingDrugScreen },
    [screenName.ConfirmBookingScreen]: { screen: ConfirmBookingScreen },
    [screenName.MessageScreen]: { screen: MessageScreen },
    [screenName.VideoCallScreen]: { screen: CallVideoScreen },
    [screenName.ReportScreen]: { screen: ReportScreen },
    [screenName.ProfileScreen]: { screen: ProfileScreen },
    [screenName.TestTodayScreen]: { screen: TestTodayScreen },
    [screenName.MyDrugScreen]: { screen: MyDrugScreen },
    [screenName.ListHospitalScreen]: { screen: HospitalScreen },
    [screenName.CityScreen]: { screen: CityScreen },
    [screenName.DistrictScreen]: { screen: DistrictScreen },
    [screenName.CommunesScreen]: { screen: CommunesScreen },
    [screenName.ChangePassScreen]: { screen: ChangePassScreen },
    [screenName.DetailDrugScreen]: { screen: DetailDrugScreen },
    [screenName.TabDoctor]: { screen: AdvisoryScreen },
    [screenName.GetAllSickScreen]: { screen: GetAllSickScreen },
    //authen
    // [screenName.LoginScreen]: { screen: LoginScreen },
    // [screenName.RegisterScreen]: { screen: RegisterScreen },
    // [screenName.ForgotPasswordScreen]: { screen: ForgotPassScreen },
    // [screenName.ListHospitalScreen]: { screen: ListHospitalScreen },
    // [screenName.InputPhoneScreen]: { screen: InputPhone },
    // [screenName.OtpScreen]: { screen: OtpScreen },
    // [screenName.TestScreen]: { screen: TestScreen },
    // [screenName.TestResultScreen]: { screen: TestResultScreen },

}, {
    initialRouteName: screenName.HomeScreen,
    headerMode: 'none',
    transitionConfig: (transitionProps) => handleCustomTransition(transitionProps),
})

export default homeStack