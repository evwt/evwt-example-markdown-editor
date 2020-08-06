const isMac = process.platform === 'darwin';

export default [
  (isMac ? { role: 'appMenu' } : {}),
  {
    label: 'File',
    id: 'file',
    submenu: [
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
      { role: 'copy' },
      ...(isMac ? [
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
      { role: 'togglefullscreen' }
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
