let path = require('path');

let Application = require('spectron').Application;
let assert = require('assert');
let sendkeys = require('sendkeys-js');

let appName = 'evwt-example-markdown-editor';
let appPath = `../dist_electron/mac/${appName}.app/Contents/MacOS/${appName}`;

describe('Application launch', () => {
  beforeEach(async function () {
    this.timeout(10000);

    this.app = new Application({
      path: path.join(__dirname, appPath),
      args: [path.join(__dirname, '..')]
    });

    await this.app.start();
  });

  afterEach(function () {
    if (this.app && this.app.isRunning()) {
      return this.app.stop();
    }
  });

  function assertPreviewMenuItem(result) {
    assert.strictEqual(result.id, 'show-preview');
    assert.strictEqual(result.accelerator, 'CmdOrCtrl+Alt+P');
    assert.strictEqual(result.acceleratorWorksWhenHidden, true);
  }

  it('shows an initial window', async function () {
    let count = await this.app.client.getWindowCount();
    assert.strictEqual(count, 1);
  });

  it('Native menu input triggers Vue events', async function () {
    // This verifies native menu events (triggered by keypresses)
    // get sent to Vue via EvMenu IPC
    let pane = await this.app.client.$('.ev-pane-main');
    let style = await pane.getAttribute('style');

    // Starts open - the keyboard shortcut should close it
    assert.strictEqual(style, 'grid-template-columns: 1fr 0px 1fr;');

    sendkeys.send('"P"', ['command', 'option']);

    style = await pane.getAttribute('style');

    // Right-most column is now closed
    assert.strictEqual(style, 'grid-template-columns: 1fr 0px 0px;');
  });

  it('Native menu input triggers App events', async function () {
    // This verifies native menu events (triggered by keypresses)
    // get sent to the app event bus

    sendkeys.send('"P"', ['command', 'option']);

    let { evwtTestEvMenuApp1, evwtTestEvMenuApp2 } = await this.app.mainProcess.env();

    let result1 = JSON.parse(evwtTestEvMenuApp1);
    let result2 = JSON.parse(evwtTestEvMenuApp2);

    assertPreviewMenuItem(result1);
    assertPreviewMenuItem(result2);
  });

  it('Native menu input triggers BrowserWindow events', async function () {
    // This verifies native menu events (triggered by keypresses)
    // get sent to the window event bus

    sendkeys.send('"P"', ['command', 'option']);

    let { evwtTestEvMenuWin1, evwtTestEvMenuWin2 } = await this.app.mainProcess.env();

    let result1 = JSON.parse(evwtTestEvMenuWin1);
    let result2 = JSON.parse(evwtTestEvMenuWin2);

    assertPreviewMenuItem(result1);
    assertPreviewMenuItem(result2);
  });

  it('Native menu data binding - populate', async function () {
    const result = await this.app.client.execute(() => window.$app.$evmenu.get('show-preview'));
    assertPreviewMenuItem(result);
  });

  it('Native menu data binding - modify', async function () {
    let pane = await this.app.client.$('.ev-pane-main');
    let style = await pane.getAttribute('style');

    // Starts open - binding should close it
    assert.strictEqual(style, 'grid-template-columns: 1fr 0px 1fr;');

    await this.app.client.execute(() => {
      let sp = window.$app.$evmenu.get('show-preview');
      sp.checked = !sp.checked;
    });

    style = await pane.getAttribute('style');

    // Right-most column is now closed
    assert.strictEqual(style, 'grid-template-columns: 1fr 0px 0px;');
  });

  it('Native menu events get triggered by $evmenu.$emit', async function () {
    await this.app.client.execute(async () => {
      window.$app.$evmenu.$emit('click', 'new-window');
    });

    let count = await this.app.client.getWindowCount();
    assert.strictEqual(count, 2);
  });

  it('Native menu events trigger $evmenu input events', async function () {
    sendkeys.send('"P"', ['command', 'option']);

    let evwtTestEvMenuEvent1 = await this.app.client.execute(() => window.evwtTestEvMenuEvent1);
    let evwtTestEvMenuEvent2 = await this.app.client.execute(() => window.evwtTestEvMenuEvent2);

    let result1 = JSON.parse(evwtTestEvMenuEvent1);
    let result2 = JSON.parse(evwtTestEvMenuEvent2);
    assertPreviewMenuItem(result1);
    assertPreviewMenuItem(result2);
  });
});
