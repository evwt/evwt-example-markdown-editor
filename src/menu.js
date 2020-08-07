const isMac = process.platform === 'darwin';

export default [
  (isMac ? { role: 'appMenu' } : {}),
  {
    label: 'File',
    id: 'file',
    submenu: [
      {
        id: 'new-window',
        accelerator: 'CmdOrCtrl+N',
        label: 'New'
      },
      {
        id: 'open-file',
        accelerator: 'CmdOrCtrl+O',
        label: 'Open...'
      },
      {
        id: 'save-file',
        accelerator: 'CmdOrCtrl+S',
        label: 'Save'
      },
      isMac ? { role: 'close' } : { role: 'quit' }
    ]
  },
  {
    label: 'Edit',
    id: 'edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      ...(isMac ? [
        { type: 'separator' },
        {
          label: 'Speech',
          submenu: [
            { role: 'startspeaking' },
            { role: 'stopspeaking' }
          ]
        }
      ] : [])
    ]
  },
  {
    label: 'View',
    id: 'view',
    submenu: [
      { role: 'toggledevtools' },
      { type: 'separator' },
      { role: 'togglefullscreen' },
      { type: 'separator' },
      {
        id: 'show-preview',
        label: 'Show Preview',
        type: 'checkbox',
        checked: true
      }
    ]
  },
  {
    label: 'Window',
    id: 'window',
    submenu: [
      { role: 'minimize' },
      { role: 'zoom' },
      ...(isMac ? [
        { type: 'separator' },
        { role: 'front' },
        { type: 'separator' },
        { role: 'window' }
      ] : [
        { role: 'close' }
      ])
    ]
  }
];
