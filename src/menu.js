const isMac = process.platform === 'darwin';

const menu = [
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
      { role: 'selectAll' },
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
        accelerator: 'CmdOrCtrl+Alt+P',
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
      { type: 'separator' },
      {
        label: 'Arrange',
        submenu: [
          {
            id: 'arrange-cascade',
            label: 'Cascade'
          },
          {
            id: 'arrange-tile',
            label: 'Tile'
          },
          {
            id: 'arrange-rows',
            label: 'Rows'
          },
          {
            id: 'arrange-columns',
            label: 'Columns'
          }
        ]
      },
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

if (isMac) {
  menu.unshift({ role: 'appMenu' });
}

export default menu;
