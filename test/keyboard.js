const isLinux = process.platform === 'linux';

// Mac (applescript via sendkeys-js)
let key = (k) => `"${k}"`;
let cmdOrCtrl = 'command';
let optionOrAlt = 'option';

// xdotool
if (isLinux) {
  key = (k) => k.toLowerCase();
  cmdOrCtrl = 'ctrl';
  optionOrAlt = 'alt';
}

module.exports = {
  cmdOrCtrl, optionOrAlt, key
};
