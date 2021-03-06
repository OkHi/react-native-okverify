package com.okhireactnativeokverify;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;

import java.util.Objects;

import io.okhi.android_core.models.OkHiException;
import io.okhi.android_core.models.OkHiLocation;
import io.okhi.android_core.models.OkHiUser;
import io.okhi.android_okverify.OkVerify;
import io.okhi.android_okverify.interfaces.OkVerifyCallback;
import io.okhi.android_okverify.models.OkHiNotification;

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
  public void init (ReadableMap notification) {
    boolean hasNotification = notification.hasKey("title")
      && notification.hasKey("text")
      && notification.hasKey("channelId")
      && notification.hasKey("channelName")
      && notification.hasKey("channelDescription");
    if (hasNotification) {
      OkVerify.init(getReactApplicationContext(), new OkHiNotification(
        Objects.requireNonNull(notification.getString("title")),
        Objects.requireNonNull(notification.getString("text")),
        Objects.requireNonNull(notification.getString("channelId")),
        Objects.requireNonNull(notification.getString("channelName")),
        Objects.requireNonNull(notification.getString("channelDescription")),
        notification.hasKey("importance") ? notification.getInt("importance") : 2,
        notification.hasKey("notificationId") ? notification.getInt("notificationId") : 1,
        notification.hasKey("notificationRequestCode") ? notification.getInt("notificationRequestCode") : 2
      ));
    } else {
      OkVerify.init(getReactApplicationContext());
    }
  }

  @ReactMethod
  public void start (ReadableMap data, Promise promise) {
    String phone = data.getString("phone");
    String locationId = data.getString("locationId");
    double lat = data.getDouble("lat");
    double lon = data.getDouble("lon");
    boolean withForeground = data.getBoolean("withForeground");
    OkHiLocation location = new OkHiLocation(Objects.requireNonNull(locationId), lat, lon);
    OkHiUser user = new OkHiUser.Builder(Objects.requireNonNull(phone)).build();
    try {
      OkVerify okVerify = new OkVerify.Builder(getCurrentActivity()).build();
      okVerify.start(user, location, withForeground, new OkVerifyCallback<String>() {
        @Override
        public void onSuccess(String result) {
          promise.resolve(result);
        }
        @Override
        public void onError(OkHiException e) {
          promise.reject(e.getCode(), e.getMessage());
        }
      });
    } catch (OkHiException exception) {
      promise.reject(exception.getCode(), exception.getMessage());
    }
  }

  @ReactMethod
  public void stop (String locationId, Promise promise) {
    if (locationId != null) {
      OkVerify.stop(getReactApplicationContext(), locationId, new OkVerifyCallback<String>() {
        @Override
        public void onSuccess(String result) {
          promise.resolve(result);
        }
        @Override
        public void onError(OkHiException e) {
          promise.reject(e.getCode(), e.getMessage());
        }
      });
    }
  }

  @ReactMethod
  public void startForegroundService (Promise promise) {
    try {
      OkVerify.startForegroundService(getReactApplicationContext());
      promise.resolve(true);
    } catch (OkHiException e) {
      promise.reject(e.getCode(), e.getMessage());
    }
  }

  @ReactMethod
  public void stopForegroundService (Promise promise) {
    OkVerify.stopForegroundService(getReactApplicationContext());
    promise.resolve(true);
  }

  @ReactMethod
  public void isForegroundServiceRunning (Promise promise) {
    promise.resolve(OkVerify.isForegroundServiceRunning(getReactApplicationContext()));
  }
}
