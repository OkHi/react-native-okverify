import { NativeModules } from 'react-native';

type ReactNativeOkverifyType = {
  multiply(a: number, b: number): Promise<number>;
};

const { ReactNativeOkverify } = NativeModules;

export default ReactNativeOkverify as ReactNativeOkverifyType;
