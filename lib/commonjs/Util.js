"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateNotification = void 0;

/**
 * @ignore
 */
const validateNotification = notification => {
  const {
    channelDescription,
    channelId,
    channelName,
    text,
    title
  } = notification;
  return typeof channelDescription === 'string' && typeof channelId === 'string' && typeof channelName === 'string' && typeof text === 'string' && typeof title === 'string';
};

exports.validateNotification = validateNotification;
//# sourceMappingURL=Util.js.map