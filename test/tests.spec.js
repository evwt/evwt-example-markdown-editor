let assert = require('assert');
let sendkeys = require('sendkeys-js');
let { bootstrapTest, teardownTest, teardownAll } = require('./hoist');
let { cmdOrCtrl, optionOrAlt, key } = require('./keyboard');

let app = null;

describe('EVStore', () => {
  beforeEach(async function () {
    this.timeout(10000);
    app = await bootstrapTest();
  });

  afterEach(async () => {
    await teardownTest(app);
  });

  after(async () => {
    teardownAll();
  });

  it('Launches', async () => {
    let count = await app.client.getWindowCount();
    assert.strictEqual(count, 1);
  });

  it('EVStore - Data created by Vue persists', async () => {
    let testKey = Math.random().toString().substr(2);
    let testVal = Math.random().toString().substr(2);

    await app.client.execute(async (key, val) => {
      window.$app.$set(window.$app.$evstore.store, `${key}`, `${val}`);
    }, testKey, testVal);

    await app.client.execute(async () => {
      window.$app.$evmenu.$emit('click', 'new-window');
    });

    let count = await app.client.getWindowCount();
    assert.strictEqual(count, 2);

    // Switch to second window
    await app.client.windowByIndex(1);

    let secondWindowStore = await app.client.execute(() => window.$app.$evstore.store);

    assert.strictEqual(secondWindowStore[testKey], testVal);
  });
});

describe('EvWindow', () => {
  beforeEach(async function () {
    this.timeout(10000);
    app = await bootstrapTest();
  });

  afterEach(async () => {
    await teardownTest(app);
  });

  after(async () => {
    teardownAll();
  });

  it('Launches', async () => {
    let count = await app.client.getWindowCount();
    assert.strictEqual(count, 1);
  });

  let randomX = Math.floor(Math.random() * 10) + 200;
  let randomY = Math.floor(Math.random() * 10) + 200;
  let randomW = Math.floor(Math.random() * 10) + 640;
  let randomH = Math.floor(Math.random() * 10) + 480;

  it('EVWindow - Stores window size and position', async () => {
    app.browserWindow.setBounds({
      x: randomX, y: randomY, width: randomW, height: randomH
    });

    await new Promise(r => setTimeout(r, 500));

    let { evwtTestEvWindow1 } = await app.mainProcess.env();

    assert.strictEqual(evwtTestEvWindow1, `evwindow.bounds.Ymxhbms= {"x":${randomX},"y":${randomY},"width":${randomW},"height":${randomH}}`);
  });
});

describe('EvMenu', () => {
  beforeEach(async function () {
    this.timeout(10000);
    app = await bootstrapTest();
  });

  afterEach(async () => {
    await teardownTest(app);
  });

  after(async () => {
    teardownAll();
  });

  function assertPreviewMenuItem(result) {
    assert.strictEqual(result.id, 'show-preview');
    assert.strictEqual(result.accelerator, 'CmdOrCtrl+Alt+P');
    assert.strictEqual(result.acceleratorWorksWhenHidden, true);
  }

  it('Launches', async () => {
    let count = await app.client.getWindowCount();
    assert.strictEqual(count, 1);
  });

  it('EVMenu - Native menu input triggers Vue events', async () => {
    // This verifies native menu events (triggered by keypresses)
    // get sent to Vue via EvMenu IPC
    let pane = await app.client.$('.ev-pane-main');
    let style = await pane.getAttribute('style');

    // Starts open - the keyboard shortcut should close it
    assert.strictEqual(style, 'grid-template-columns: 1fr 0px 1fr;');

    try {
      sendkeys.send(key('P'), [cmdOrCtrl, optionOrAlt]);
    } catch (error) {
      console.log(error.toString());
    }

    style = await pane.getAttribute('style');

    // Right-most column is now closed
    assert.strictEqual(style, 'grid-template-columns: 1fr 0px 0px;');
  });

  it('Native menu input triggers App events', async () => {
    // This verifies native menu events (triggered by keypresses)
    // get sent to the app event bus

    sendkeys.send(key('P'), [cmdOrCtrl, optionOrAlt]);

    let { evwtTestEvMenuApp1, evwtTestEvMenuApp2 } = await app.mainProcess.env();

    let result1 = JSON.parse(evwtTestEvMenuApp1);
    let result2 = JSON.parse(evwtTestEvMenuApp2);

    assertPreviewMenuItem(result1);
    assertPreviewMenuItem(result2);
  });

  it('Native menu input triggers BrowserWindow events', async () => {
    // This verifies native menu events (triggered by keypresses)
    // get sent to the window event bus

    sendkeys.send(key('P'), [cmdOrCtrl, optionOrAlt]);

    let { evwtTestEvMenuWin1, evwtTestEvMenuWin2 } = await app.mainProcess.env();

    let result1 = JSON.parse(evwtTestEvMenuWin1);
    let result2 = JSON.parse(evwtTestEvMenuWin2);

    assertPreviewMenuItem(result1);
    assertPreviewMenuItem(result2);
  });

  it('Native menu data binding - populate', async () => {
    const result = await app.client.execute(() => window.$app.$evmenu.get('show-preview'));
    assertPreviewMenuItem(result);
  });

  it('Native menu data binding - modify', async () => {
    let pane = await app.client.$('.ev-pane-main');
    let style = await pane.getAttribute('style');

    // Starts open - binding should close it
    assert.strictEqual(style, 'grid-template-columns: 1fr 0px 1fr;');

    await app.client.execute(() => {
      let sp = window.$app.$evmenu.get('show-preview');
      sp.checked = !sp.checked;
    });

    style = await pane.getAttribute('style');

    // Right-most column is now closed
    assert.strictEqual(style, 'grid-template-columns: 1fr 0px 0px;');
  });

  it('Native menu events get triggered by $evmenu.$emit', async () => {
    await app.client.execute(async () => {
      window.$app.$evmenu.$emit('click', 'new-window');
    });

    let count = await app.client.getWindowCount();
    assert.strictEqual(count, 2);
  });

  it('Native menu events trigger $evmenu input events', async () => {
    sendkeys.send(key('P'), [cmdOrCtrl, optionOrAlt]);

    let evwtTestEvMenuEvent1 = await app.client.execute(() => window.evwtTestEvMenuEvent1);
    let evwtTestEvMenuEvent2 = await app.client.execute(() => window.evwtTestEvMenuEvent2);

    let result1 = JSON.parse(evwtTestEvMenuEvent1);
    let result2 = JSON.parse(evwtTestEvMenuEvent2);
    assertPreviewMenuItem(result1);
    assertPreviewMenuItem(result2);
  });
});
