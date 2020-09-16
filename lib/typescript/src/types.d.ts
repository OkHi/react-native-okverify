/**
 * Defines the structure of the notification object that'll be used by the device to start a momentary foreground service, once a verification signal is detected.
 */
export interface OkHiNotification {
    /**
     * The title of the notification
     */
    title: string;
    /**
     * The body copy of the notification
     */
    text: string;
    /**
     * (Android): The notification's channel id.
     * See: https://developer.android.com/training/notify-user/channels
     */
    channelId: string;
    /**
     * (Android): The notification's channel's name.
     * See: https://developer.android.com/training/notify-user/channels
     */
    channelName: string;
    /**
     * (Android): The notification's channel's description.
     * See: https://developer.android.com/training/notify-user/channels
     */
    channelDescription: string;
    /**
     * (Android): The notification's channel's importance.
     * See: https://developer.android.com/reference/android/app/NotificationManager
     */
    importance?: number;
    /**
     * (Android): The notification's resource icon id.
     * See: https://developer.android.com/training/notify-user/channels
     */
    icon?: number;
}
/**
 * @ignore
 */
export declare type OkVerifyType = {
    init(notification: OkHiNotification | {
        [key: string]: any;
    }): void;
    start(configuration: {
        branchId: string;
        clientKey: string;
        phone: string;
        locationId: string;
        lat: number;
        lon: number;
        mode: string;
    }): Promise<string>;
    stop(locationId: string): Promise<string>;
};