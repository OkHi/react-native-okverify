package com.okhireactnativeokverify;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class ReactNativeOkVerifyModule extends ReactContextBaseJavaModule {

  public ReactNativeOkVerifyModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @NonNull
  @Override
  public String getName() {
    return "ReactNativeOkverify";
  }

  @ReactMethod
  public void multiply(int a, int b, Promise promise) {
    promise.resolve(a*b*4);
  }
}
