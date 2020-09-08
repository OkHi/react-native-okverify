import type { OkHiNotification } from './index';
/**
 * @ignore
 */
export const validateNotification = (notification: OkHiNotification) => {
  const {
    channelDescription,
    channelId,
    channelName,
    text,
    title,
  } = notification;
  return (
    typeof channelDescription === 'string' &&
    typeof channelId === 'string' &&
    typeof channelName === 'string' &&
    typeof text === 'string' &&
    typeof title === 'string'
  );
};
