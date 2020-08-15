import path from 'path';
import fs from 'fs';

export function readFile(win, filePath) {
  if (!filePath) return;

  fs.readFile(filePath, (err, fileContents) => {
    if (err) throw err;
    win.webContents.send('eeme:open-file', { filePath, fileContents: fileContents.toString() });
  });

  finishFileOpening(win, filePath);
}

export function finishFileOpening(win, filePath) {
  win.setRepresentedFilename(filePath);
  let parsedPath = path.parse(filePath);
  win.setTitle(parsedPath.base);
}
