import {showMessage, hideMessage} from 'react-native-flash-message';
function showShort(
  message: string,
  type: 'warning' | 'info' | 'success' | 'danger',
) {
  show(message, type, 3000);
}
function showLong(
  message: string,
  type: 'warning' | 'info' | 'success' | 'danger',
) {
  show(message, type, 6000);
}
function show(
  message: string,
  type: 'warning' | 'info' | 'success' | 'danger',
  duration: number,
) {
  if (duration != 0 && !duration) duration = 3000;
  let _type = 'info';
  switch (type) {
    case 'warning':
    case 'info':
    case 'success':
    case 'danger':
      _type = type;
      break;
  }
  showWithTitle('baseApp', message, _type, duration);
}
function showWithTitle(
  message: string,
  description: string,
  type: 'warning' | 'info' | 'success' | 'danger',
  duration: number,
) {
  showMessage({
    message,
    description,
    type,
    duration,
  });
}

export default {
  showWithTitle,
  show,
  showLong,
  showShort,
};
