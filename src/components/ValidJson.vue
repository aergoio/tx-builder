<template>
  <span class="json-valid">
    <Icon :size="16" :name="isValid ? 'checkmark-circle' : 'danger-circle'"></Icon>
    <span v-if="!isValid" class="json-valid-text">Invalid JSON</span>
  </span>
</template>


<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Icon } from './icons/';

@Component({ components: { Icon, }})
export default class BuilderView extends Vue {
  @Prop(String)
  value: string | undefined;

  get isValid() {
    try {
      JSON.parse(this.value);
      return true;
    } catch(e) {
      return false;
    }
  }
}
</script>

<style lang="scss">
.json-valid {
  margin-left: 5px;
  display: inline-flex;
  align-items: center;
  .json-valid-text {
    font-size: .85em;
    opacity: .7;
    margin-left: 6px;
  }
}
</style>