let path = require('path');
let Application = require('spectron').Application;
let { execSync } = require('child_process');

const appName = 'evwt-example-markdown-editor';

const isMac = process.platform === 'darwin';
const isLinux = process.platform === 'linux';

async function bootstrapTest() {
  if (isLinux) {
    appPath = `../dist_electron/linux-unpacked/${appName}`;
  }

  let appPath = `../dist_electron/mac/${appName}.app/Contents/MacOS/${appName}`;

  let app = new Application({
    path: path.join(__dirname, appPath),
    args: [path.join(__dirname, '..')],
    chromeDriverArgs: [
      '--disable-setuid-sandbox',
      '--no-sandbox',
      '--headless',
      '--disable-dev-shm-usage',
      '--remote-debugging-port=9222'
    ]
  });

  await app.start();

  // Add delay to help run tests on Linux
  await new Promise(r => setTimeout(r, 200));

  return app;
}

async function teardownTest(app) {
  if (app && app.isRunning()) {
    await app.stop();
    await new Promise(r => setTimeout(r, 200));
  }
}

async function teardownAll() {
  if (isMac) {
    execSync(`killall ${appName} 2>/dev/null || true`);
    await new Promise(r => setTimeout(r, 200));
  }
}

module.exports = {
  bootstrapTest,
  teardownTest,
  teardownAll,
  isMac,
  isLinux,
  appName
};
