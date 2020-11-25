import { NativeModules, Platform } from 'react-native';
import {
  OkHiException,
  OkHiUser,
  isGooglePlayServicesAvailable,
  isLocationPermissionGranted,
  requestEnableGooglePlayServices,
  requestEnableLocationServices,
  requestBackgroundLocationPermission,
  isBackgroundLocationPermissionGranted,
} from '@okhi/react-native-core';
import { validateNotification } from './Util';
import type { OkHiLocation } from '@okhi/react-native-core';
import type { OkVerifyType, OkHiNotification } from './types';

export { OkHiNotification } from './types';

/**
 * @ignore
 */
const OkVerify: OkVerifyType = NativeModules.ReactNativeOkverify;

/**
 * The init method performs crucial checks and verification signal uploads that are necessary for the library to work effectively.
 * The init method takes in an optional, but highly recommended notification configuration that'll be used to start an Android foreground service.
 * The service will attempt to immediately upload verification signals as soon as they occur.
 */
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

/**
 * Attempts to start the address verification process.
 * @param configuration The OkCollectSuccessResponse object once an address has been successfully created. (https://okhi.github.io/react-native-okcollect/interfaces/okcollectsuccessresponse.html)
 * @returns {Promise<string>} Promise that resolves with the location id.
 */
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

/**
 * Attemps to stop the verification process of particular location.
 * @param {string} locationId
 * @returns {Promise<string>} The locaiton id.
 */
export const stopVerification = (locationId: string) => {
  if (Platform.OS !== 'android') {
    return Promise.resolve(locationId);
  }
  return OkVerify.stop(locationId);
};

/**
 * Checks whether all necessary permissions and services are available in order to start the verification process.
 * @param {Object} configuration Object that determines whether or not to request these permissions and services from the user.
 * @param {boolean} configuration.requestServices Flag that determines whether to request the services from the user.
 * @returns {Promise<boolean>} A promise that resolves to a boolean value indicating whether or not all conditions are met to star the verification process.
 */
export const canStartVerification = (configuration: {
  requestServices: boolean;
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
    const { requestServices } = configuration;
    try {
      if (requestServices) {
        await requestEnableGooglePlayServices();
        await requestEnableLocationServices();
        await requestBackgroundLocationPermission();
      }
      Promise.all([
        isGooglePlayServicesAvailable(),
        isLocationPermissionGranted(),
        isBackgroundLocationPermissionGranted(),
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

export const startForegroundService = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    OkVerify.startForegroundService()
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

export const stopForegroundService = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    OkVerify.stopForegroundService()
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

export const isForegroundServiceRunning = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    OkVerify.isForegroundServiceRunning()
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
