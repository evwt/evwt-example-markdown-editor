import {
  app, BrowserWindow
} from 'electron';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';
import { EvWindow } from 'evwt';
import { createWindow } from '../windowManagement';
import { readFile } from '../fileOpening';

const isDevelopment = process.env.NODE_ENV !== 'production';

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

app.on('evmenu:arrange-cascade', () => {
  EvWindow.arrange('cascade');
});

app.on('evmenu:arrange-tile', () => {
  EvWindow.arrange('tile');
});

app.on('evmenu:arrange-rows', () => {
  EvWindow.arrange('rows');
});

app.on('evmenu:arrange-columns', () => {
  EvWindow.arrange('columns');
});
