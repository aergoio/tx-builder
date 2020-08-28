<template>
  <div class="contract-address-input">
    <input type="text" v-model="contractAddress" placeholder="Enter contract address" @keyup="handleContractAddress" />
    <div>
      <Icon name="checkmark-circle" :size=18 v-show="status == 'loaded'"></Icon>
      <Icon name="danger-circle" :size=18 v-show="status == 'error'"></Icon>
      <LoadingIndicator :size=18 v-show="status == 'loading'"></LoadingIndicator>
    </div>
  </div>
</template>


<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { Icon, LoadingIndicator } from './icons/';
import { Address } from '@herajs/common';

@Component({ components: { Icon, LoadingIndicator, }})
export default class ConractAddressInput extends Vue {
  contractAddress: string = '';
  debounceTimer: NodeJS.Timeout | null = null;

  get status() {
    return this.$store.state.contract.status;
  }

  get addressInState() {
    return this.$store.state.contract.address;
  }

  @Watch('addressInState')
  onAddressChanged(address) {
    this.contractAddress = address;
  }

  async handleContractAddress() {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    if (this.contractAddress) {
      try {
        const address = new Address(this.contractAddress);
        this.debounceTimer = setTimeout(async () => {
          const found = await this.$store.dispatch('setContractAddress', { address: `${address}` });
          if (found) {
            this.$router.push(`/contract/${address}`);
          }
        }, 300);
      } catch(e) {
        // Ignore invalid address
      }
    }
  }
}
</script>

<style lang="scss">
.contract-address-input {
  background-color: #000;
  border: 0;
  padding: 0 10px;
  color: #fff;
  flex: 1;
  max-width: 500px;
  display: flex;
  align-items: center;

  input {
    color: inherit;
    line-height: inherit;
    background-color: transparent;
    flex: 1;
    border: 0;
    outline: 0;
  }
  div {
    margin-left: 5px;
  }
}
</style>