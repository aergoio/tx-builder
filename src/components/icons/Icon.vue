<template>
  <div class="icon" :class="[`icon--${name}`]" :style="{width: size+'px'}">
    <svg :width="`${size}px`" viewBox="0 0 100 100">
      <use :xlink:href="url"></use>
    </svg>
    <div v-if="badge" class="badge">{{badgeText}}</div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType, FunctionalComponentOptions } from 'vue';
import { IconName } from './types';

const icons = require('./img/*.svg');

export default Vue.extend({
  name: 'Icon',
  props: {
    name: {
      type: String as PropType<IconName>,
      required: true,
    },
    size: {
      type: Number,
      default: 24,
    },
    badge: Boolean,
    badgeText: String,
  },
  computed: {
    url() {
      return icons[this.name];
    },
  },
  components: {
    ...icons,
  },
});
</script>

<style lang="scss">
.icon {
  line-height: 1;
  vertical-align: middle;
  position: relative;
  display: inline-block;
  position: relative;

  svg { 
    display: inline-block;
    vertical-align: middle;
  }

  .badge {
    position: absolute;
    background: #ff337f;
    top: 0;
    right: 0;
    transform: translate(6px, -6px);
    display: flex;
    font-size: 12px;
    line-height: 18px;
    padding: 0 4px;
    border-radius: 10px;
    color: #fff;
    align-items: center;
    justify-content: center;
  }
}
.icon:hover {
  .hover-darken {
    fill: #777;
  }
}
.icon:hover {
  .hover-remove-opacity {
    opacity: 0.8;
  }
}
.icon.active, .router-link-active .icon {
  .active-remove-opacity {
    opacity: 1;
  }
}
.inverted-colors .icon {
  .invertible-stroke {
    stroke: #fff;
  }
  .invertible-fill {
    fill: #aaa;
  }
}
</style>
