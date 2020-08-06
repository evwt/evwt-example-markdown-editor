<template>
  <ev-toolbar
    :icon-size="16"
    icon-pos="above"
    :icon-show="true"
    :labels="false"
    :min-width="40"
    :font-size="11"
    :padding="3">
    <ev-toolbar-item
      icon="file-plus"
      label="New"
      tooltip="New File" />

    <ev-toolbar-item
      icon="folder-open"
      label="Open"
      tooltip="Open File"
      @click.native="handleOpenFile" />

    <ev-toolbar-item
      icon="save"
      label="Save"
      tooltip="Save File" />
  </ev-toolbar>
</template>

<script>
import { EvToolbar, EvToolbarItem } from 'evwt';

export default {
  components: {
    EvToolbar,
    EvToolbarItem
  },

  methods: {
    handleOpenFile() {
      this.$evmenu.$emit('input', 'open-file');
    }
  }
};
</script>
