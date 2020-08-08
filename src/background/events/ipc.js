import fs from 'fs';
import {
  dialog, BrowserWindow, ipcMain
} from 'electron';
import { finishFileOpening } from '../fileOpening';
import { createWindow } from '../windowManagement';

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
