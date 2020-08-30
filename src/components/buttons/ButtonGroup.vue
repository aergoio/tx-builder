<template>
  <div class="button-group" :class="[horizontal ? 'button-group-horizontal' : vertical ? 'button-group-vertical' : '', ]">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'ButtonGroup',
  props: {
    horizontal: {
      type: Boolean,
      default: true,
    },
    vertical: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style lang="scss">
.button-group {
  display: flex;
  justify-content: flex-start;
  
  &.button-group-vertical {
    flex-direction: column;
    align-items: stretch;

    > * + * { margin-top: 10px; }
  }

  &.button-group-horizontal {
    align-items: center;
    margin-left: -5px;
    margin-right: -5px;
    > * {
      flex: 1;
      margin-right: 5px;
      margin-left: 5px;
    }
  }

  .button.active {
    outline: 1px solid #00C789;
  }
}
</style>