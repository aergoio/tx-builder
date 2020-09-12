<template lang="html">
  <div class="arg" v-if="arg">
    <div v-if="!arg.variadic">
      <h4>{{arg.name}}</h4>
      <input class="text-input" type="text" :value="valueCopy" @input="handleInput($event.target.value)">
      <ValidJson :value="valueCopy"></ValidJson>
    </div>
    <div v-else>
      <h4 class="variadic">Variadic argument</h4>
      <div v-for="idx in variadicArgs" :key="idx" class="variadic-arg">
        <input class="text-input" type="text" v-model="valueCopy[Number(idx)]" @input="handleInput($event.target.value, Number(idx))">
        <Button @click="removeVariadicArg(Number(idx))" v-if="variadicCount > 1">-</Button>
        <Button @click="addVariadicArg" v-if="idx === variadicCount - 1">+</Button>
        <ValidJson :value="valueCopy[Number(idx)]"></ValidJson>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop, Emit } from 'vue-property-decorator';
import { Button } from './buttons/';
import ValidJson from './ValidJson.vue';

@Component({ components: { Button, ValidJson, }})
export default class BuilderView extends Vue {
  @Prop() readonly value: string | string[] | undefined;
  @Prop(Object) readonly arg: { name: string } | undefined;
  valueCopy: any = '';
  variadicCount = 1;

  @Watch('value', { deep: true, immediate: true })
  valueChanged() {
    this.valueCopy = Array.isArray(this.value) ? this.value.map(v => JSON.stringify(v)) : JSON.stringify(this.value);
  }

  handleInput(value, subIndex) {
    if (typeof subIndex === 'undefined') {
      this.valueCopy = value;
    } else {
      this.valueCopy[subIndex] = value;
      // Remove undefined's, they mean that the variadic arg was deleted
      if (typeof value === 'undefined') {
        this.valueCopy = this.valueCopy.filter(item => typeof item !== 'undefined');
      }
    }

    try {
      const json = Array.isArray(this.valueCopy) ? this.valueCopy.map(v => JSON.parse(v)) : JSON.parse(value);
      this.$emit('input', json);
    } catch(e) {
    }
  }

  isVariadic(arg) {
    return arg.name === '...';
  }

  addVariadicArg() {
    this.variadicCount += 1;
  }

  removeVariadicArg(idx) {
    this.handleInput(undefined, idx);
    this.variadicCount -= 1;
  }

  get variadicArgs() {
    return [...Array(this.variadicCount).keys()];
  }
}
</script>

<style lang="scss">
.arguments {
  margin-left: 20px;

  .arg {
    counter-reset: varargs -1;
    .variadic-arg {
      counter-increment: varargs 1;
      margin-bottom: 5px;
      &:before {
        content: ' ' counter(varargs);
        margin-right: 7px;
      }
    }
  }

  .text-input {
    min-width: 180px; 
  }
}
</style>