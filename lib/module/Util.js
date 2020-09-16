/**
 * @ignore
 */
export const validateNotification = notification => {
  const {
    channelDescription,
    channelId,
    channelName,
    text,
    title
  } = notification;
  return typeof channelDescription === 'string' && typeof channelId === 'string' && typeof channelName === 'string' && typeof text === 'string' && typeof title === 'string';
};
//# sourceMappingURL=Util.js.map