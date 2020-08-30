<template lang="html">
  <div class="top-bar">
    <NetworkSelector></NetworkSelector>
    <ContractAddressInput></ContractAddressInput>
    <LoginWithAergoConnect @click.native="connectAccount" :loggedInAddress="activeAccount ? activeAccount.address : ''"></LoginWithAergoConnect>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import NetworkSelector from './NetworkSelector.vue';
import LoginWithAergoConnect from './LoginWithAergoConnect.vue';
import ContractAddressInput from './ContractAddressInput.vue';
import { Address } from '@herajs/common';

@Component({ components: { NetworkSelector, LoginWithAergoConnect, ContractAddressInput, }})
export default class App extends Vue {
  contractAddress: string = '';
  account: any = null;

  get activeChainId(): any {
    return this.$store.state.activeChainId;
  }
  get activeAccount(): any {
    return this.$store.state.activeAccount;
  }

  async connectAccount() {
    const account = await this.$store.dispatch('refreshActiveAccount');
    const chainId = this.activeChainId.chainid.magic;
    if (chainId != account.chainId) {
      alert(`The selected account's chain id does not match the expected chain id ${chainId}. Please select another account.`);
      return;
    }
    console.log('logged in', account);
  }
}
</script>

<style lang="scss">
.top-bar {
  background-color: #171717;
  padding: 0 12px;
  color: #eee;
  display: flex;
  justify-content: space-between;

  line-height: 45px
}
</style>