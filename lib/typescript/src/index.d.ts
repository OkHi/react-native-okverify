import { OkHiUser } from '@okhi/react-native-core';
import type { OkHiLocation } from '@okhi/react-native-core';
import type { OkHiNotification } from './types';
export { OkHiNotification } from './types';
/**
 * The init method performs crucial checks and verification signal uploads that are necessary for the library to work effectively.
 * The init method takes in an optional, but highly recommended notification configuration that'll be used to start an Android foreground service.
 * The service will attempt to immediately upload verification signals as soon as they occur.
 */
export declare const init: (notification?: OkHiNotification | undefined) => void;
/**
 * Attempts to start the address verification process.
 * @param configuration The OkCollectSuccessResponse object once an address has been successfully created. (https://okhi.github.io/react-native-okcollect/interfaces/okcollectsuccessresponse.html)
 * @returns {Promise<string>} Promise that resolves with the location id.
 */
export declare const startVerification: (configuration: {
    location: OkHiLocation;
    user: OkHiUser;
    auth: any;
}) => Promise<string>;
/**
 * Attemps to stop the verification process of particular location.
 * @param {string} locationId
 * @returns {Promise<string>} The locaiton id.
 */
export declare const stopVerification: (locationId: string) => Promise<string>;
/**
 * Checks whether all necessary permissions and services are available in order to start the verification process.
 * @param {Object} configuration Object that determines whether or not to request these permissions and services from the user.
 * @param {boolean} configuration.requestServices Flag that determines whether to request the services from the user.
 * @returns {Promise<boolean>} A promise that resolves to a boolean value indicating whether or not all conditions are met to star the verification process.
 */
export declare const canStartVerification: (configuration: {
    requestServices: boolean;
}) => Promise<boolean>;
