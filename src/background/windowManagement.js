import { v4 as uuidv4 } from 'uuid';
import {
  dialog, BrowserWindow
} from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import { EvMenu, EvWindow } from 'evwt';
import { readFile } from './fileOpening';

export function createWindow(restoreId = uuidv4()) {
  let options = {
    show: false,
    width: 800,
    height: 600,
    minWidth: 640,
    minHeight: 480,
    webPreferences: {
      nodeIntegration: true
    }
  };

  let storedOptions = EvWindow.getStoredOptions(restoreId, options);
  let win = new BrowserWindow({ ...options, ...storedOptions });

  EvMenu.attach(win);
  EvWindow.startStoringOptions(restoreId, win);

  listenEvents(win);

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    // if (!process.env.IS_TEST) win.webContents.openDevTools();
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
