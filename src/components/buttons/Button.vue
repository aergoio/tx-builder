<template>
  <button
    class="button"
    :class="classes"
    :disabled="disabled"
    @click.prevent="handleClick"
  >
    <template v-if="loading">
      <LoadingIndicator class="button-loading-indicator" />
    </template>
    <template v-else>
      <slot></slot>
    </template>
  </button>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { ButtonType, ButtonTypes, ButtonSize, ButtonSizes } from './types'
import LoadingIndicator from '../icons/LoadingIndicator.vue'
import { RawLocation } from 'vue-router'

/**
 * Either handle click event by `@click` or pass a router location into the `to` prop.
 */
export default Vue.extend({
  name: 'Button',
  props: {
    type: {
      type: String as PropType<ButtonType>,
      default: ButtonTypes[0],
    },
    size: {
      type: String as PropType<ButtonSize>,
      default: ButtonSizes[0],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    to: {
      type: [String, Object] as PropType<RawLocation>,
    },
  },
  components: {
    LoadingIndicator,
  },
  beforeUpdate() {
    if (this.loading) {
      // Animate into the loading state
      const $el = this.$el as HTMLElement
      $el.style.minWidth = $el.clientWidth + 'px'
      $el.style.width = $el.clientWidth + 'px'
      setTimeout(() => {
        $el.style.minWidth = '50px'
        $el.style.width = 'auto'
      }, 300)
    }
  },
  computed: {
    classes(): string[] {
      return [
        `button-type-${this.type}`,
        `button-size-${this.size}`,
        this.loading ? `button-loading` : '',
        this.type.match(/^primary/) ? 'inverted-colors' : '',
      ]
    },
  },
  methods: {
    handleClick() {
      if (
        typeof this.to !== 'undefined' &&
        this.to &&
        typeof this.$router !== 'undefined'
      ) {
        this.$router.push(this.to)
      } else {
        this.$emit('click')
      }
    },
  },
})
</script>

<style lang="scss">
.button {
  /* Typography */
  font-weight: 500;
  font-size: (15/16) * 1em;

  /* Sizing */
  box-sizing: border-box;
  min-height: 2em; /* 30px */
  line-height: 1.5em;
  padding: 0.25em 1em;

  /* Borders and background */
  outline: none;
  border: 0;
  box-shadow: inset 0 0 1px 0 rgba(0, 0, 0, 0.6);
  background-color: transparent;

  /* Content alignment */
  display: inline-flex;
  text-decoration: none;
  text-align: center;
  align-items: center;
  justify-content: space-around;

  /* Behavior */
  cursor: pointer;
  transition: min-width 0.35s ease-in;

  &[disabled] {
    cursor: not-allowed;
    opacity: 0.6;
  }

  &.button-size-default {
    min-height: 30px;
    line-height: 30px;
    padding: 0 10px;
  }
  &.button-size-big {
    line-height: 45px;
    padding: 0 10px;
    font-size: 1.1em;
  }

  &.button-type-default {
    background-color: #282828;
    color: #fff;
  }
  &.button-type-primary {
    background-color: #00c789;
    color: #fff;

    &[disabled] {
      cursor: not-allowed;
      opacity: 0.3;
    }
  }
  &.button-type-secondary {
    box-shadow: none;
  }
  &.button-type-icon,
  &.button-type-primary-icon {
    box-shadow: none;
    padding: 0;
    line-height: initial;
    min-height: 0;
  }
  &.button-type-primary-icon {
    background-color: #ff337f;
    border-radius: 100%;
    line-height: 56px;
    min-height: 56px;
    width: 56px !important;
    &[disabled] {
      opacity: 0.5;
    }
  }
}
/*:disabled.btn-big {
  display: block;
  background-color: #282828;
  line-height: 45px;
  padding: 0 10px;
  font-size: 1.1em;
  text-align: center;
  margin-right: 20px;
  cursor: pointer;
  &.primary {
    background-color: #00C789;
  }
}
*/
</style>
