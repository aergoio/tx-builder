<template>
  <div class="component login-with-aergo-connect" :class="{ dark }">
    <span class="icon"
      ><Icon :name="dark ? 'aergo-light' : 'aergo'" :size="22"
    /></span>
    <span class="label" v-if="!loggedInAddress">
      <span class="label-main" style="text-transform: uppercase">Login</span>
      <span class="label-sub">with Aergo Connect 3.0</span>
    </span>
    <span class="label" v-else>
      <span class="label-main">{{ loggedInAddress }}</span>
      <span class="label-sub">Logged in</span>
    </span>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { Icon } from './icons'

export default Vue.extend({
  name: 'InputButton',
  props: {
    dark: Boolean,
    loggedInAddress: String,
  },
  components: {
    Icon,
  },
})
</script>

<style lang="scss">
.component.login-with-aergo-connect {
  display: flex;
  align-items: center;
  padding: 4px 10px;
  cursor: pointer;
  width: 200px;

  &:hover {
    background-color: #1a1a1a;
  }

  > .icon {
    border-radius: 100%;
    border: 1px solid #f4f4f4;
    background-color: #fff;
    padding: 3px;
    margin-right: 10px;
  }

  .label {
    display: flex;
    flex-direction: column;
    line-height: 1.2;
    overflow: hidden;
    font-size: 0.85em;
    padding-right: 10px;

    .label-main {
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .label-sub {
      opacity: 0.5;
      font-size: 0.9em;
    }
  }

  &.dark {
    &:hover {
      background-color: rgba(#000, 0.3);
    }
    > .icon {
      background-color: #000;
      border-color: #000;
    }
    > .label {
      color: #fff;
    }
  }
}
</style>
