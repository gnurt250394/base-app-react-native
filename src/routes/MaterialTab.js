import * as React from 'react';
import { BottomNavigation, Text } from 'react-native-paper';
import R from 'res/R';
import HomeScreen from 'screens/HomeScreen';
import AccountScreen from 'screens/AccountScreen';
import NotificationScreen from 'screens/NotificationScreen';
import screenName from 'configs/screenName';
import utils from 'configs/utils';
import LoginScreen from 'screens/Login/LoginScreen';


class MaterialTab extends React.Component {
    state = {
        index: 0,
        routes: [
            { key: screenName.HomeScreen, title: 'Trang chủ', icon: R.images.icons.home.ic_home, color: R.colors.defaultColor },
            { key: screenName.AccountScreen, title: 'Tài khoản', icon: R.images.icons.home.ic_account, color: '#009688' },
            { key: screenName.NotificationScreen, title: 'Thông báo', icon: R.images.icons.home.ic_noti, color: '#795548' },
        ],
    };

    _handleIndexChange = index => this.setState({ index });

    _renderScene = BottomNavigation.SceneMap({
        [screenName.HomeScreen]: HomeScreen,
    });

    render() {
        return (
            <BottomNavigation
                navigationState={this.state}
                onIndexChange={this._handleIndexChange}
                renderScene={this._renderScene}
                shifting={true}
                inactiveColor={R.colors.secondColor}
                activeColor={R.colors.black}
                onTabPress={({ route }) => {
                    switch (route.key) {
                        case screenName.HomeScreen:
                            break;
                        case screenName.AccountScreen:
                        case screenName.NotificationScreen:
                            if (!utils.database.token) {
                                utils.alertWarn('Vui lòng đăng nhập để xem nội dung này')
                            }
                            break;
                        default:
                            break;
                    }
                }}
            />
        );
    }
}

export default MaterialTab