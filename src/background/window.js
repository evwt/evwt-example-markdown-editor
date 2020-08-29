import { v4 as uuidv4 } from 'uuid';
import { dialog } from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import { EvMenu, EvWindow } from 'evwt/background';
import { readFile } from './file';

export function createWindow(restoreId = uuidv4()) {
  let options = {
    show: false,
    width: 800,
    height: 600,
    minWidth: 512,
    minHeight: 384,
    webPreferences: {
      nodeIntegration: true
    }
  };

  let evWindow = new EvWindow(restoreId, options);
  let win = evWindow.browserWindow;

  EvMenu.attach(win);

  listenEvents(win);

  // EVWT Test Suite events - not needed for normal apps
  if (process.env.npm_lifecycle_event === 'test') {
    listenTestEvents(win);
  }

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (process.env.npm_lifecycle_event !== 'test') win.webContents.openDevTools();
  } else {
    createProtocol('app');
    win.loadURL('app://./index.html');
  }

  return win;
}

function listenEvents(win) {
  win.on('evmenu:open-file', async () => {
    let { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        {
          name: 'Markdown',
          extensions: ['md', 'markdown']
        }
      ]
    });

    if (canceled || filePaths.length === 0) {
      return;
    }

    let newWindow = createWindow(filePaths[0]);
    newWindow.once('ready-to-show', () => {
      readFile(newWindow, filePaths[0]);
      newWindow.show();
    });
  });

  win.once('ready-to-show', () => {
    win.show();
  });

  win.on('closed', () => {
    win = null;
  });
}

// EVWT Test Suite - Not needed for normal apps
function listenTestEvents(win) {
  win.on('evmenu', item => {
    process.env.evwtTestEvMenuWin1 = JSON.stringify(item);
  });

  win.on('evmenu:show-preview', item => {
    process.env.evwtTestEvMenuWin2 = JSON.stringify(item);
  });

  win.on('evcontextmenu', item => {
    process.env.evwtTestEvContextMenuWin1 = JSON.stringify(item);
  });

  win.on('evcontextmenu:my-context-menu:item-1', item => {
    process.env.evwtTestEvContextMenuWin2 = JSON.stringify(item);
  });
}
