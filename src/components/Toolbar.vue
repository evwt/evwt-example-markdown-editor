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
      icon="window-maximize"
      label="Sidebar"
      tooltip="Show Sidebar" />
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
