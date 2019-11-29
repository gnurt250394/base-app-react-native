import { createStackNavigator } from 'react-navigation-stack'
import { createAppContainer } from 'react-navigation'
import screenName from 'configs/screenName'
import { fromLeft, zoomIn, zoomOut, fadeIn, fadeOut, flipX, flipY, fromBottom, fromRight, fromTop, } from 'react-navigation-transitions';
import BottomTabStack from './BottomTabStack';
import MessageScreen from 'screens/community/MessageScreen';
import CallVideoScreen from 'screens/community/CallVideoScreen';
import ProfileScreen from 'screens/AccountScreen/ProfileScreen';
import HospitalScreen from 'screens/AccountScreen/HospitalScreen';
import CityScreen from 'screens/AccountScreen/CityScreen';
import DistrictScreen from 'screens/AccountScreen/DistrictScreen';
import CommunesScreen from 'screens/AccountScreen/CommunesScreen';
import ChangePassScreen from 'screens/AccountScreen/ChangePassScreen';
import GetAllSickScreen from 'screens/HomeScreen/GetAllSickScreen';
import VoiceScreen from 'screens/Voice/VoiceScreen';
import TextToSpeech from 'screens/Voice/TextToSpeech';
import CanvasScreen from 'screens/Voice/CanvasScreen';
const handleCustomTransition = ({ scenes }) => {
    const prevScene = scenes[scenes.length - 2];
    const nextScene = scenes[scenes.length - 1];
    // Custom transitions go there
    if (prevScene
        && prevScene.route.routeName === screenName.HomeScreen
        && nextScene.route.routeName === screenName.HomeScreen) {
        return zoomIn();
    }

    return fromRight();
}
const homeStack = createStackNavigator({
    [screenName.HomeScreen]: { screen: BottomTabStack },
    [screenName.MessageScreen]: { screen: MessageScreen },
    [screenName.VideoCallScreen]: { screen: CallVideoScreen },
    [screenName.ProfileScreen]: { screen: ProfileScreen },
    [screenName.ListHospitalScreen]: { screen: HospitalScreen },
    [screenName.CityScreen]: { screen: CityScreen },
    [screenName.DistrictScreen]: { screen: DistrictScreen },
    [screenName.CommunesScreen]: { screen: CommunesScreen },
    [screenName.ChangePassScreen]: { screen: ChangePassScreen },
    [screenName.GetAllSickScreen]: { screen: GetAllSickScreen },
    [screenName.VoiceScreen]: { screen: VoiceScreen },
    [screenName.TextToSpeech]: { screen: TextToSpeech },
    [screenName.CanvasScreen]: { screen: CanvasScreen },
}, {
    initialRouteName: screenName.CanvasScreen,
    headerMode: 'none',
    transitionConfig: (transitionProps) => handleCustomTransition(transitionProps),
})

export default homeStack