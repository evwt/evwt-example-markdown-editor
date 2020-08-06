<template>
  <MonacoEditor
    ref="editor"
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
    }

  },

  mounted() {
    // Fit editor to parent
    let sizeObserver = new ResizeObserver(this.handleResize);
    sizeObserver.observe(this.$refs.editor.$el.parentElement);
  },

  methods: {
    handleResize: throttle(function(entries) {
      let { contentRect } = entries[entries.length - 1];
      if (this.$refs.editor) {
        this.$refs.editor.$el.style.width = `${contentRect.width}px`;
        this.$refs.editor.$el.style.height = `${contentRect.height}px`;
        this.$refs.editor.getEditor().layout();
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
