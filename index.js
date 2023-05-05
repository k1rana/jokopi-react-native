/**
 * @format
 */
import 'react-native-gesture-handler';

import {AppRegistry} from 'react-native';

import {name as appName} from './app.json';
import Router from './src/router';

AppRegistry.registerComponent(appName, () => Router);
