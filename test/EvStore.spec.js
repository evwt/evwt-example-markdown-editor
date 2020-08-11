let path = require('path');
let Application = require('spectron').Application;
let assert = require('assert');
let { execSync } = require('child_process');

const appName = 'evwt-example-markdown-editor';
const isMac = process.platform === 'darwin';
const isLinux = process.platform === 'linux';

let appPath = `../dist_electron/mac/${appName}.app/Contents/MacOS/${appName}`;

if (isLinux) {
  appPath = `../dist_electron/linux-unpacked/${appName}`;
}

describe('EvStore', () => {
  beforeEach(async function () {
    if (isMac) {
      execSync(`killall ${appName} 2>/dev/null || true`);
    }

    this.timeout(10000);

    this.app = new Application({
      path: path.join(__dirname, appPath),
      args: [path.join(__dirname, '..')],
      chromeDriverArgs: [
        '--disable-setuid-sandbox',
        '--no-sandbox',
        '--headless',
        '--disable-dev-shm-usage',
        '----disable-dev-shm-using',
        '--remote-debugging-port=9222'
      ]
    });

    await this.app.start();

    // Add delay to help run tests on Linux
    await new Promise(r => setTimeout(r, 200));
  });

  afterEach(function () {
    if (this.app && this.app.isRunning()) {
      return this.app.stop();
    }
  });

  it('Store data created from Vue persists', async function () {
    let testKey = Math.random().toString().substr(2);
    let testVal = Math.random().toString().substr(2);

    await this.app.client.execute(async (key, val) => {
      window.$app.$set(window.$app.$evstore.store, `${key}`, `${val}`);
    }, testKey, testVal);

    await this.app.client.execute(async () => {
      window.$app.$evmenu.$emit('click', 'new-window');
    });

    let count = await this.app.client.getWindowCount();
    assert.strictEqual(count, 2);

    // Switch to second window
    await this.app.client.windowByIndex(1);
    await new Promise(r => setTimeout(r, 200));

    let secondWindowStore = await this.app.client.execute(() => window.$app.$evstore.store);

    assert.strictEqual(secondWindowStore[testKey], testVal);
  });
});
