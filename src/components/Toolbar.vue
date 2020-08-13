<template>
  <ev-toolbar>
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
      label="Sidebar"
      tooltip="Show Preview" />

    <ev-toolbar-item
      icon="undo-alt"
      label="Undo"
      tooltip="Undo Typing"
      @click.native="$emit('undo')" />

    <ev-toolbar-item
      icon="redo-alt"
      label="Redo"
      tooltip="Redo Typing"
      @click.native="$emit('redo')" />

    <ev-toolbar-item
      icon="cut"
      label="Cut"
      tooltip="Cut Text"
      @click.native="$emit('cut')" />

    <ev-toolbar-item
      icon="copy"
      label="Copy"
      tooltip="Copy Text"
      @click.native="$emit('copy')" />

    <ev-toolbar-item
      icon="paste"
      label="Paste"
      tooltip="Paste Text"
      @click.native="$emit('paste')" />
  </ev-toolbar>
</template>

<script>
import { EvToolbar, EvToolbarItem } from 'evwt';

export default {
  components: {
    EvToolbar,
    EvToolbarItem
  }
};
</script>
