/* eslint-disable no-undef */
import 'react-native-polyfill-globals/auto';

globalThis.TextEncoder = TextEncoder;
window.TextEncoder = TextEncoder;

if (typeof Buffer === 'undefined') {
  global.Buffer = require('buffer/').Buffer;
}

if (typeof BigInt === 'undefined') {
  global.BigInt = require('big-integer');
}

if (!global.performance && global._chronoNow) {
  global.performance = {
    now: global._chronoNow,
  };
}
