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
      appLayout: {
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
            sizes: ['1fr', '1fr'],
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
      }
    };
  },

  created() {
    ipcRenderer.on('eeme:open-file', (event, { fileContents }) => {
      this.markdown = fileContents;
    });
  }
};
</script>
