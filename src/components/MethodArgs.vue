<template lang="html">
  <div v-if="args && args.length" class="arguments">
    <MethodArg v-for="arg in args" :key="arg.name" :arg="arg" v-model="valueCopy[arg.idx]" @input="handleInput(arg.idx, $event)"></MethodArg>
  </div>
  <div v-else>(None)</div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop, Emit } from 'vue-property-decorator';
import { Button } from './buttons/';
import ValidJson from './ValidJson.vue';
import MethodArg from './MethodArg.vue';

type Value = string | string[];

@Component({ components: { Button, ValidJson, MethodArg, }})
export default class BuilderView extends Vue {
  @Prop(Array) readonly value: any[] | undefined;
  @Prop(Object) readonly method: { arguments: { name: string }[] } | undefined;
  valueCopy: any[] = [];
  variadicCount = 1;

  @Watch('value', { deep: true, immediate: true })
  valueChanged() {
    this.valueCopy = this.value;
  }

  @Watch('method', { deep: true, immediate: true })
  methodChanged() {
    if (!this.method) return;
    let idx = 0;
    for (const arg of this.method.arguments) {
      this.valueCopy[idx++] = arg.name === '...' ? [...new Array(this.variadicCount).keys()].map(_ => '') : '';
    }
  }

  get args() {
    return this.method?.arguments.map((arg, idx) => ({ ...arg, idx, variadic: arg.name === '...' }));
  }

  @Emit('input')
  handleInput(idx, value) {
    this.valueCopy[idx] = value;
    return this.valueCopy;
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
}
</style>