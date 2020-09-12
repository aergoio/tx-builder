<template lang="html">
  <div class="builder-view">
    <div class="form">
      <form ref="form" spellcheck="false">
        <fieldset>
          <h3>Contract Method</h3>
          <div class="actions">
            <div class="row">
              <div class="btn-action"
                v-for="func in availableFunctions"
                :class="{ active: contractMethod && contractMethod.name === func.name }"
                @click="contractMethod = func">{{func.name}}</div>
            </div>
          </div>
          <h3>Arguments</h3>
          <MethodArgs :method="selectedContractFunction" v-model="contractArgs"></MethodArgs>
        </fieldset>
        <fieldset>
          <Button type="primary" @click="query">Query</Button>
        </fieldset>
      </form>
    </div>
    <div>
      
      <div class="result">
        <div v-if="status === 'loading'">
          <div class="receipt-status">
            <LoadingIndicator :size="24"></LoadingIndicator>
            <span>Loading query result...</span>
          </div>
        </div>
        <div v-if="status === 'loaded'" style="padding: 0 20px;">
          <h3>Result</h3>
          <pre class="receipt-json" v-if="result">{{JSON.stringify(result, null, 2)}}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import JsonView from '../components/JsonView.vue';
import { TxTypes, Amount, Address, encodeBuffer } from '@herajs/common';
import { Contract } from '@herajs/client';
import { Icon, LoadingIndicator } from './icons/';
import { Button } from './buttons/';
import MethodArgs from './MethodArgs.vue';

@Component({ components: { JsonView, LoadingIndicator, Icon, Button, MethodArgs, }})
export default class QueryView extends Vue {
  contractMethod = null;
  contractArgs = [];
  result = null;
  status = '';
 
  get contractAddress() {
    return this.$store.state.contract.address;
  }

  get contractAbi() {
    return this.$store.state.contract.abi;
  }

  get availableFunctions() {
    return this.contractAbi?.functions.filter(func => func.name !== 'constructor' && func.name !== 'default') || [];
  }

  get selectedContractFunction() {
    if (!this.contractMethod) return undefined;
    return this.contractAbi?.functions.find(func =>
      func.name === this.contractMethod.name
    );
  }

  async query() {
    this.status = 'loading';
    this.result = await this.$store.dispatch('queryContract', {
      address: this.contractAddress,
      abi: this.contractAbi,
      method: this.contractMethod.name,
      args: this.contractArgs.flat()
    });
    this.status = 'loaded';
  }
}
</script>

<style lang="scss">
.query-view {
  display: flex;
  > div {
    flex: 1;
  }
}

</style>