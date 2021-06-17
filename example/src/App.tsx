import * as React from 'react';
import { StyleSheet, View, Button } from 'react-native';
import OkHiLocationManager from '@okhi/react-native-okcollect';
import {
  canStartVerification,
  startVerification,
} from '@okhi/react-native-okverify';

// import secret from './secret.json';

export default function App() {
  const [launch, setLaunch] = React.useState(false);

  console.log(launch);

  const handleOnSuccess = async (response: any) => {
    setLaunch(false);
    try {
      const isReady = await canStartVerification({
        requestServices: true,
      });
      if (isReady) {
        const result = await startVerification(response);
        console.log('Started verification for: ' + result);
      } else {
        console.log('Not ready');
      }
    } catch (error) {
      console.log(error.code);
      console.log(error.message);
    }
  };

  const handleOnError = () => {
    setLaunch(false);
  };

  const handleOnCloseRequest = () => {
    setLaunch(false);
  };

  return (
    <View style={styles.container}>
      <Button onPress={() => setLaunch(true)} title="Start Verification" />
      <OkHiLocationManager
        user={{ phone: '+254700110590' }}
        onSuccess={handleOnSuccess}
        onError={handleOnError}
        onCloseRequest={handleOnCloseRequest}
        launch={launch}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
