import { createStackNavigator } from 'react-navigation-stack'
import { createAppContainer } from 'react-navigation'
import screenName from 'configs/screenName'
import { fromLeft, zoomIn, zoomOut, fadeIn, fadeOut, flipX, flipY, fromBottom, fromRight, fromTop, } from 'react-navigation-transitions';
import BottomTabStack from './BottomTabStack';
import HomeScreen from 'screens/HomeScreen';
const handleCustomTransition = ({ scenes }) => {
    const prevScene = scenes[scenes.length - 2];
    const nextScene = scenes[scenes.length - 1];
    // Custom transitions go there
    if (prevScene
        && prevScene.route.routeName === screenName.HOME
        && nextScene.route.routeName === screenName.HOME) {
        return zoomIn();
    }

    return fromRight();
}
const homeStack = createStackNavigator({
    [screenName.HOME]: { screen: HomeScreen },
}, {
    initialRouteName: screenName.HOME,
    headerMode: 'none',
    transitionConfig: (transitionProps) => handleCustomTransition(transitionProps),
})

export default homeStack