<template>
  <MonacoEditor
    ref="monaco"
    v-model="text"
    language="markdown"
    :options="options" />
</template>

<script>
import MonacoEditor from 'vue-monaco';
import { throttle } from 'lodash';

export default {
  components: {
    MonacoEditor
  },

  props: {
    value: String
  },

  data() {
    return {
      options: {
        renderLineHighlight: 'none',
        currentLines: false,
        scrollBeyondLastLine: false,
        lineNumbers: 'off',
        folding: false,
        minimap: {
          enabled: false
        }
      }

    };
  },

  computed: {
    text: {
      get() {
        return this.value;
      },

      set(val) {
        this.$emit('input', val);
      }
    },

    editor() {
      return this.$refs.monaco.getEditor();
    }
  },

  mounted() {
    // Fit editor to parent
    let sizeObserver = new ResizeObserver(this.handleResize);
    sizeObserver.observe(this.$refs.monaco.$el.parentElement);
  },

  methods: {
    undo() {
      this.editor.trigger('source', 'undo');
    },

    redo() {
      this.editor.trigger('source', 'redo');
    },

    cut() {
      this.editor.focus();
      document.execCommand('cut');
    },

    copy() {
      this.editor.focus();
      document.execCommand('copy');
    },

    paste() {
      this.editor.focus();
      document.execCommand('paste');
    },

    handleResize: throttle(function(entries) {
      let { contentRect } = entries[entries.length - 1];
      if (this.$refs.monaco) {
        this.$refs.monaco.$el.style.width = `${contentRect.width}px`;
        this.$refs.monaco.$el.style.height = `${contentRect.height}px`;
        this.$refs.monaco.getEditor().layout();
      }
    }, 20)
  }
};
</script>

<style>
.monaco-editor .decorationsOverviewRuler {
  display: none;
}
</style>
