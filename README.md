# @okhi/react-native-okverify

The OkVerify Android library enables you to verify a user&#39;s OkHi address

## Prerequisite libraries

- [@okhi/react-native-core](https://github.com/OkHi/react-native-core#okhireact-native-core)
- [@okhi/react-native-okcollect](https://github.com/OkHi/react-native-okcollect#okhireact-native-okcollect)

## Installation

```sh
npm install @okhi/react-native-okverify
```

## Usage

### initialisation

Run the `init` method once on app start. Place this in your `index.js` file.

```js
import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import * as OkVerify from '@okhi/react-native-okverify';

// init method takes in an optional notification configuration that'll be used
// to start a foreground service in order to transmit verification
// signals to OkHi servers.

OkVerify.init({
  title: 'Verification in progress',
  text: 'Verification in progress',
  channelDescription: 'OkHi verification status updates',
  channelId: 'okhi',
  channelName: 'OkHi Verification',
});

// OkVerify.init();

AppRegistry.registerComponent(appName, () => App);
```

### implementation

```js
import React, { useState } from 'react';
import { Button, Rationale } from 'react-native';
import {
  OkHiException,
  OkHiUser,
  requestLocationPermission,
} from '@okhi/react-native-core';
import OkHiLocationManager, {
  OkCollectSuccessResponse,
} from '@okhi/react-native-okcollect';
import {
  canStartVerification,
  startVerification,
} from '@okhi/react-native-okverify';
import auth from 'OkHiAuth.js';

function App() {
  const [launch, setLaunch] = React.useState(false);

  const locationPermissionRationale: Rationale = {
    message:
      'Hey, we need permissions to enable you create addresses at your current location',
    title: 'Location permission required',
    buttonPositive: 'Grant',
  };

  useEffect(() => {
    // location permission is required to enable users to create
    // addresses at their current location
    async function requestPermission() {
      await requestLocationPermission(locationPermissionRationale);
    }
    requestPermission();
  }, []);

  const user: OkHiUser = {
    firstName: 'Bob',
    lastName: 'Mark',
    phone: '+254712345678', // Make sure its in MSISDN standard format
  };

  const handleOnSuccess = async (response: OkCollectSuccessResponse) => {
    setLaunch(false);
    try {
      // setting requestServices to true will request any missing permission
      // or any unavailable service to be turned on by the user on your behalf
      const canStart = await canStartVerification({
        requestServices: true,
        locationPermissionRationale,
      });
      if (canStart) {
        const result = await startVerification(response);
        console.log('Started verification for: ' + result);
      }
    } catch (error) {
      console.log(error.code);
      console.log(error.message);
    }
  };

  const handleOnError = (error: OkHiException) => {
    setLaunch(false);
    console.log(error.code);
    console.log(error.message);
  };

  // called when user taps on the top right close button
  const handleOnCloseRequest = () => {
    setLaunch(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <Button onPress={() => setLaunch(true)} title="Start Verification" />
      <OkHiLocationManager
        auth={auth}
        user={user}
        onSuccess={handleOnSuccess}
        onError={handleOnError}
        onCloseRequest={handleOnCloseRequest}
        launch={launch}
      />
    </View>
  );
}
```

## Documentation

- [Guides](https://docs.okhi.co/v/v5.0-alpha/okhi-on-your-react-native-app)

- [Best Practices](https://docs.google.com/document/d/1kxolQJ4n6tEgReuqVLYpDVMW--xvqv5UQ7AdvrN0Uw0)

- [API Reference](https://okhi.github.io/react-native-okverify/)

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
