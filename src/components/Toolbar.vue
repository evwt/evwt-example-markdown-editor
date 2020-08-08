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
      menu-id="open-file"
      icon="folder-open"
      label="Open"
      tooltip="Open File"
      @click.native="$evmenu.$emit('click', 'open-file')" />

    <ev-toolbar-item
      menu-id="save-file"
      icon="save"
      label="Save"
      tooltip="Save File"
      @click.native="$evmenu.$emit('click', 'save-file')" />

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
      label="cut"
      tooltip="Cut Text"
      @click.native="$emit('cut')" />

    <ev-toolbar-item
      icon="copy"
      label="copy"
      tooltip="Copy Text"
      @click.native="$emit('copy')" />

    <ev-toolbar-item
      icon="paste"
      label="paste"
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
