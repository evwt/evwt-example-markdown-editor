<template>
  <div class="markdown-body" v-html="rendered" />
</template>

<script>
import '@/style/markdown-github.css';
import markdownIt from 'markdown-it';

let md = markdownIt();

export default {
  props: {
    value: String
  },

  computed: {
    rendered() {
      return md.render(this.value);
    }
  }

};
</script>
