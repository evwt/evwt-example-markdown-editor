import path from 'path';
import fs from 'fs';
import {
  app, dialog, protocol, BrowserWindow, ipcMain
} from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';
import { EvMenu, EvWindow } from 'evwt';
import { v4 as uuidv4 } from 'uuid';

const isDevelopment = process.env.NODE_ENV !== 'production';

EvMenu.activate();

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
]);

ipcMain.handle('save-file', async (e, filePath, fileBytes) => {
  fs.writeFileSync(filePath, fileBytes);
});

ipcMain.handle('save-new-file', async (e, fileBytes) => {
  let win = BrowserWindow.fromWebContents(e.sender);

  let { canceled, filePath } = await dialog.showSaveDialog(win, {
    securityScopedBookmarks: true,
    filters: [
      {
        name: 'Markdown',
        extensions: ['md', 'markdown']
      }
    ]
  });

  if (!canceled) {
    fs.writeFileSync(filePath, fileBytes);
    finishFileOpening(win, filePath);
    return filePath;
  }
});

ipcMain.handle('new-window', async (e, id) => {
  createWindow(id);
});

function createWindow(restoreId = uuidv4()) {
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
  EvWindow.startStoringOptions(win, restoreId);

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

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol('app');
    win.loadURL('app://./index.html');
  }

  win.once('ready-to-show', () => {
    win.show();
  });

  win.on('closed', () => {
    win = null;
  });

  return win;
}

app.on('second-instance', (event, argv) => {
  if (argv.length >= 2) {
    let filePath = argv[1];
    let win = createWindow(filePath);
    readFile(win, filePath);
  }
});

app.on('open-file', (event, filePath) => {
  event.preventDefault();
  let win = createWindow(filePath);
  readFile(win, filePath);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow('blank');
  }
});

app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString());
    }
  }

  // There might already be windows from open-file, so only create a new
  // one if no windows
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow('blank');
  }
});

if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    });
  } else {
    process.on('SIGTERM', () => {
      app.quit();
    });
  }
}

let readFile = (win, filePath) => {
  if (!filePath) return;

  fs.readFile(filePath, (err, fileContents) => {
    if (err) throw err;
    win.webContents.send('eeme:open-file', { filePath, fileContents: fileContents.toString() });
  });

  finishFileOpening(win, filePath);
};

function finishFileOpening(win, filePath) {
  win.setRepresentedFilename(filePath);
  let parsedPath = path.parse(filePath);
  win.setTitle(parsedPath.base);
}
