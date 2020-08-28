<template lang="html">
  <div class="editor" ref="container"></div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch, Emit } from 'vue-property-decorator'

import * as monaco from 'monaco-editor';

// @ts-ignore
self.MonacoEnvironment = {
  getWorkerUrl: function(moduleId, label) {
    if (label === 'json') {
      return '/json.worker.js';
    }
    /*if (label === 'css') {
      return '/css.worker.js';
    }
    if (label === 'html') {
      return '/html.worker.js';
    }
    if (label === 'typescript' || label === 'javascript') {
      return '/ts.worker.js';
    }*/
    return '/editor.worker.js';
  },
};

@Component
export default class JsonView extends Vue {
  @Prop(Object) readonly data: any | undefined;
  value: string = '';
  editor: any = null;

  @Watch('data', { deep: true, immediate: true })
  dataChanged() {
    this.value = JSON.stringify(this.data, null, 2);
    if (this.editor) {
      const position = this.editor.getPosition();
      this.editor.setValue(this.value);
      this.editor.setPosition(position);
    }
  }

  @Emit('change')
  valueChanged() {
    this.value = this.editor.getValue();
    try {
      const data = JSON.parse(this.value);
      return data;
    } catch(e) {
      // Ignore JSON parse error
      return null;
    }
  }

  mounted() {
    this.value = JSON.stringify(this.data, null, 2)
    this.editor = monaco.editor.create(this.$refs.container as HTMLElement, {
      value: this.value,
      language: 'json',
      theme: 'vs-dark',
      minimap: { enabled: false },
      matchBrackets: 'never',
      renderIndentGuides: false,
      folding: false,
    });
    this.editor.onDidPaste(() => this.valueChanged());
    this.editor.onKeyUp(() => this.valueChanged());
  }
}
</script>

<style lang="scss">
.editor {
  height: 200px;
}
</style>

