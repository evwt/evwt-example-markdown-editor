<template>
  <ev-layout
    v-show="loaded"
    ref="evLayout"
    :layout.sync="appLayout"
    @pane-hidden="handlePaneHidden"
    @pane-shown="handlePaneShown"
    @drop.native.prevent.stop
    @dragover.native.prevent.stop>
    <template v-slot:toolbar>
      <Toolbar
        :active="activeToolbarItems"
        @undo="undo"
        @redo="redo"
        @cut="cut"
        @copy="copy"
        @paste="paste"
        @toggle-devtools="toggleDevtools" />
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
      loaded: false,
      markdown: '',
      filePath: '',
      activeToolbarItems: {},
      appLayout: {
        name: 'app',
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

  computed: {
    editorClass() {
      return '';
    }
  },

  created() {
    window.onload = () => {
      this.loaded = true;
    };

    electron.ipcRenderer.on('eeme:open-file', (event, { filePath, fileContents }) => {
      this.markdown = fileContents;
      this.filePath = filePath;
      this.$evmenu.get('save-file').enabled = true;
      this.$evmenu.get('show-preview').checked = true;
    });

    this.$evmenu.$on('input:save-file', async () => {
      if (this.filePath) {
        electron.ipcRenderer.invoke('save-file', this.filePath, this.markdown);
      } else {
        let filePath = await electron.ipcRenderer.invoke('save-new-file', this.markdown);
        this.filePath = filePath;
      }
    });

    this.$evmenu.$on('input:new-window', () => {
      electron.ipcRenderer.invoke('new-window');
    });
  },

  mounted() {
    this.$evmenu.$on('input:show-preview', ({ checked }) => {
      if (checked) {
        this.$refs.evLayout.showPane('preview');
      } else {
        this.$refs.evLayout.hidePane('preview');
      }
    });

    this.$evmenu.get('show-preview').checked = !this.$refs.evLayout.getPane('preview').hidden;
  },

  methods: {
    async toggleDevtools() {
      let opened = await electron.ipcRenderer.invoke('eeme:devtools-toggle');
      this.$set(this.activeToolbarItems, 'toggle-devtools', opened);
    },

    handlePaneHidden(pane) {
      if (pane === 'preview') {
        this.$evmenu.get('show-preview').checked = false;
      }
    },

    handlePaneShown(pane) {
      if (pane === 'preview') {
        this.$evmenu.get('show-preview').checked = true;
      }
    },

    handleDrop(files) {
      if (files.length) {
        electron.ipcRenderer.invoke('file-dragged-in', files[0].path);
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
