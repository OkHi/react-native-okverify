import { NativeModules, Rationale, Platform } from 'react-native';
import {
  OkHiException,
  OkHiUser,
  isGooglePlayServicesAvailable,
  isLocationPermissionGranted,
  isLocationServicesEnabled,
  requestEnableGooglePlayServices,
  requestEnableLocationServices,
  requestLocationPermission,
} from '@okhi/react-native-core';
import { validateNotification } from './Util';
import type { OkHiLocation } from '@okhi/react-native-core';
import type { OkVerifyType } from './types';

export interface OkHiNotification {
  title: string;
  text: string;
  channelId: string;
  channelName: string;
  channelDescription: string;
  importance?: number;
  icon?: number;
}

const OkVerify: OkVerifyType = NativeModules.ReactNativeOkverify;

export const init = (notification?: OkHiNotification) => {
  if (Platform.OS !== 'android') {
    return;
  }
  if (notification) {
    const isValid = validateNotification(notification);
    if (!isValid) {
      throw new OkHiException({
        code: OkHiException.BAD_REQUEST_CODE,
        message: 'invalid notification structure',
      });
    }
    OkVerify.init(notification);
  } else {
    OkVerify.init({});
  }
};

export const startVerification = (configuration: {
  location: OkHiLocation;
  user: OkHiUser;
  auth: any;
}): Promise<string> => {
  return new Promise((resolve, reject) => {
    const { auth, location, user } = configuration;
    const { phone } = user;
    const { id, lat, lon } = location;
    const branchId = auth.getBranchId();
    const clientKey = auth.getClientKey();
    const mode = auth.getContext().getMode();

    if (Platform.OS !== 'android') {
      return reject(
        new OkHiException({
          code: OkHiException.UNSUPPORTED_PLATFORM_CODE,
          message: OkHiException.UNSUPPORTED_PLATFORM_MESSAGE,
        })
      );
    }

    if (typeof id !== 'string') {
      return reject(
        new OkHiException({
          code: OkHiException.BAD_REQUEST_CODE,
          message: 'Missing id from location object',
        })
      );
    }
    if (typeof lat !== 'number' || typeof lon !== 'number') {
      return reject(
        new OkHiException({
          code: OkHiException.BAD_REQUEST_CODE,
          message: 'Missing coords from location object',
        })
      );
    }
    if (typeof phone !== 'string') {
      return reject(
        new OkHiException({
          code: OkHiException.BAD_REQUEST_CODE,
          message: 'Missing phone from user object',
        })
      );
    }
    if (typeof branchId !== 'string' || typeof clientKey !== 'string') {
      return reject(
        new OkHiException({
          code: OkHiException.UNAUTHORIZED_CODE,
          message: 'Missing credentials from authentication object',
        })
      );
    }
    OkVerify.start({
      branchId,
      clientKey,
      lat,
      lon,
      phone,
      mode,
      locationId: id,
    })
      .then(resolve)
      .catch((error: OkHiException) =>
        reject(
          new OkHiException({
            code: error.code || OkHiException.UNKNOWN_ERROR_CODE,
            message: error.message,
          })
        )
      );
  });
};

export const stopVerification = (locationId: string) => {
  if (Platform.OS !== 'android') {
    return Promise.resolve(locationId);
  }
  return OkVerify.stop(locationId);
};

export const canStartVerification = (configuration: {
  requestServices: boolean;
  locationPermissionRationale: Rationale;
}): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    if (Platform.OS !== 'android') {
      reject(
        new OkHiException({
          code: OkHiException.UNSUPPORTED_PLATFORM_CODE,
          message: OkHiException.UNSUPPORTED_PLATFORM_MESSAGE,
        })
      );
    }
    const { requestServices, locationPermissionRationale } = configuration;
    try {
      if (requestServices) {
        await requestEnableGooglePlayServices();
        await requestEnableLocationServices();
        await requestLocationPermission(locationPermissionRationale);
      }
      Promise.all([
        isGooglePlayServicesAvailable(),
        isLocationPermissionGranted(),
        isLocationServicesEnabled(),
      ])
        .then((result) => {
          resolve(!result.includes(false));
        })
        .catch(reject);
    } catch (error) {
      reject(error);
    }
  });
};
