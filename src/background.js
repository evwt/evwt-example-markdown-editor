import path from 'path';
import fs from 'fs';
import {
  app, dialog, protocol, BrowserWindow, ipcMain
} from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';
import { EvMenu } from 'evwt';
import { v4 as uuidv4 } from 'uuid';

const isDevelopment = process.env.NODE_ENV !== 'production';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let windows = new Map();

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

function createWindow(id = uuidv4()) {
  // Create the browser window.
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 640,
    minHeight: 480,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION
    }
  });

  windows.set(id, win);

  EvMenu.attach(win);

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

    readFile(win, filePaths[0]);
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol('app');
    // Load the index.html when not in development
    win.loadURL('app://./index.html');
  }

  win.on('closed', () => {
    win = null;
    windows.delete(id);
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

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (windows.size === 0) {
    createWindow();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString());
    }
  }

  // There might already be windows from open-file, so only create a new
  // one if no windows
  if (windows.size === 0) {
    createWindow();
  }
});

// Exit cleanly on request from parent process in development mode.
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
