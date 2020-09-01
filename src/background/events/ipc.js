import fs from 'fs';
import {
  dialog, BrowserWindow, ipcMain, webContents
} from 'electron';
import { EvWindow } from 'evwt/background';
import { finishFileOpening, readFile } from '../file';
import { createWindow } from '../window';

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

    // since we use the file path as the restoreId, we start storing with the new path
    EvWindow.startStoringOptions(filePath, win);

    finishFileOpening(win, filePath);
    return filePath;
  }
});

ipcMain.handle('file-dragged-in', (e, filePath) => {
  let win = BrowserWindow.fromWebContents(e.sender);
  readFile(win, filePath);
});

ipcMain.handle('new-window', async (e, id) => {
  createWindow(id);
});

ipcMain.handle('eeme:devtools-toggle', async (e, id) => {
  let win = BrowserWindow.fromWebContents(e.sender);
  let devtools = webContents.getAllWebContents().find(w => w.devToolsWebContents);
  win.webContents.toggleDevTools();
  return !devtools;
});
