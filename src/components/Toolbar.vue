<template>
  <ev-toolbar>
    <!-- <ev-toolbar-item
      menu-id="new-window"
      icon="file-alt"
      label="New"
      tooltip="New Window" /> -->

    <ev-toolbar-item
      menu-id="open-file"
      icon="folder-open"
      label="Open"
      tooltip="Open File" />

    <ev-toolbar-item
      menu-id="save-file"
      icon="save"
      label="Save"
      tooltip="Save File" />

    <ev-toolbar-item
      menu-id="show-preview"
      icon="window-sidebar"
      label="Preview"
      tooltip="Show Preview" />

    <ev-toolbar-item
      icon="undo-alt"
      label="Undo"
      tooltip="Undo Typing"
      @click="$emit('undo')" />

    <ev-toolbar-item
      icon="redo-alt"
      label="Redo"
      tooltip="Redo Typing"
      @click="$emit('redo')" />

    <ev-toolbar-item
      icon="cut"
      label="Cut"
      tooltip="Cut Text"
      @click="$emit('cut')" />

    <ev-toolbar-item
      icon="copy"
      label="Copy"
      tooltip="Copy Text"
      @click="$emit('copy')" />

    <ev-toolbar-item
      icon="paste"
      label="Paste"
      tooltip="Paste Text"
      @click="$emit('paste')" />

    <!-- <ev-toolbar-item
      icon="tools"
      label="DevTools"
      tooltip="Toggle Developer Tools"
      :active="active['toggle-devtools']"
      @click="$emit('toggle-devtools')" /> -->
  </ev-toolbar>
</template>

<script>
import { EvToolbar, EvToolbarItem } from 'evwt/components';

export default {
  components: {
    EvToolbar,
    EvToolbarItem
  },

  props: {
    active: Object
  }
};
</script>
