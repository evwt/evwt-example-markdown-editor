<template>
  <ev-layout :layout="appLayout">
    <template v-slot:toolbar>
      <Toolbar />
    </template>

    <template v-slot:editor>
      <Editor v-model="markdown" />
    </template>

    <template v-slot:preview>
      <Preview v-model="markdown" />
    </template>
  </ev-layout>
</template>

<script>
import { ipcRenderer } from 'electron';
import { EvLayout } from 'evwt';
import Editor from '@/components/Editor';
import Preview from '@/components/Preview';
import Toolbar from '@/components/Toolbar';
import '@/style/theme-2020.scss';

export default {
  components: {
    EvLayout,
    Editor,
    Preview,
    Toolbar
  },

  data() {
    return {
      markdown: '',
      filePath: ''
    };
  },

  computed: {
    appLayout() {
      return {
        direction: 'row',
        sizes: ['auto', '1fr'],
        panes: [
          {
            name: 'toolbar',
            resizable: false
          },
          {
            name: 'main',
            direction: 'column',
            sizes: ['1fr', this.previewSize],
            panes: [
              {
                name: 'editor'
              },
              {
                name: 'preview'
              }
            ]
          }
        ]
      };
    },

    previewSize() {
      let size = '1fr';

      if (!this.$evmenu.get('show-preview').checked) {
        size = 0;
      }

      return size;
    }
  },

  created() {
    ipcRenderer.on('eeme:open-file', (event, { filePath, fileContents }) => {
      this.markdown = fileContents;
      this.filePath = filePath;
      this.$evmenu.get('save-file').enabled = true;
      this.$evmenu.get('show-preview').checked = true;
    });

    this.$evmenu.$on('input:save-file', () => {
      ipcRenderer.invoke('save-file', this.filePath, this.markdown);
    });

    this.$evmenu.$on('input:new-window', () => {
      ipcRenderer.invoke('new-window');
    });
  }
};
</script>
