import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import * as OkVerify from '@okhi/react-native-okverify';

OkVerify.init({
  title: 'Verification in progress',
  text: 'Verification in progress',
  channelDescription: 'OkHi verification status updates',
  channelId: 'okhi',
  channelName: 'OkHi Verification',
});

// OkVerify.init();

AppRegistry.registerComponent(appName, () => App);
