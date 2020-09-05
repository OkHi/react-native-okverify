import type { OkHiNotification } from './index';

export type OkVerifyType = {
  init(notification: OkHiNotification | { [key: string]: any }): void;
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
