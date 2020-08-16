<template>
  <ev-layout :layout="appLayout" @drop.native.prevent.stop @dragover.native.prevent.stop>
    <template v-slot:toolbar>
      <Toolbar
        @undo="undo"
        @redo="redo"
        @cut="cut"
        @copy="copy"
        @paste="paste" />
    </template>

    <template v-slot:editor>
      <ev-drop-zone @drop="handleDrop">
        <Editor ref="editor" v-model="markdown" />
      </ev-drop-zone>
    </template>

    <template v-slot:preview>
      <Preview v-model="markdown" />
    </template>
  </ev-layout>
</template>

<script>
import { ipcRenderer } from 'electron';
import { EvLayout, EvDropZone } from 'evwt/components';
import Editor from '@/components/Editor';
import Preview from '@/components/Preview';
import Toolbar from '@/components/Toolbar';
import '@/style/theme-2020.scss';

export default {
  components: {
    EvLayout,
    Editor,
    Preview,
    Toolbar,
    EvDropZone
  },

  data() {
    return {
      markdown: '',
      filePath: ''
    };
  },

  computed: {
    editorClass() {
      return '';
    },

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

    this.$evmenu.$on('input:save-file', async () => {
      if (this.filePath) {
        ipcRenderer.invoke('save-file', this.filePath, this.markdown);
      } else {
        let filePath = await ipcRenderer.invoke('save-new-file', this.markdown);
        this.filePath = filePath;
      }
    });

    this.$evmenu.$on('input:new-window', () => {
      ipcRenderer.invoke('new-window');
    });
  },

  methods: {
    handleDrop(files) {
      if (files.length) {
        ipcRenderer.invoke('file-dragged-in', files[0].path);
      }
    },

    undo() {
      this.$refs.editor.undo();
    },

    redo() {
      this.$refs.editor.redo();
    },

    cut() {
      this.$refs.editor.cut();
    },

    copy() {
      this.$refs.editor.copy();
    },

    paste() {
      this.$refs.editor.paste();
    }
  }
};
</script>
