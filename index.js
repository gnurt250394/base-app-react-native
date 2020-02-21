/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './ComponentA';
import {name as appName} from './app.json';
import bgMessage from 'components/bgMessage';
AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => bgMessage);