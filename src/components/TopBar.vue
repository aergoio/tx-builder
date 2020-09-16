<template lang="html">
  <div class="top-bar">
    <NetworkSelector></NetworkSelector>
    <ContractAddressInput></ContractAddressInput>
    <span class="reset-btn" @click="reset">Reset</span>
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
import { ChainConfigs } from '../config';

@Component({ components: { NetworkSelector, LoginWithAergoConnect, ContractAddressInput, }})
export default class App extends Vue {
  contractAddress: string = '';
  account: any = null;

  get chainId(): any {
    return this.$store.state.chainId;
  }
  get activeAccount(): any {
    return this.$store.state.activeAccount;
  }

  async connectAccount() {
    const account = await this.$store.dispatch('refreshActiveAccount');
    console.log('logged in', account);
    const chainId = account.chainId;
    if (chainId === this.chainId) {
      return;
    }
    let nodeUrl = '';
    const chainConfig = ChainConfigs.find(conf => conf.chainId === chainId);
    if (chainConfig) {
      nodeUrl = chainConfig.nodeUrl;
    } else {
      nodeUrl = prompt(`Unknown chain id: ${chainId}\nPlease enter a Node URL to connect to this chain.`);
    }
    this.$store.dispatch('setChain', { nodeUrl });
  }

  async reset() {
    const check = confirm('Reset contract address and tx body?');
    if (!check) return;
    await this.$store.dispatch('reset');
    if (this.$router.currentRoute.path !== '/') {
      await this.$router.push('/');
    }
  }
}
</script>

<style lang="scss">
.top-bar {
  background-color: #111;
  padding: 0 12px;
  color: #eee;
  display: flex;
  justify-content: space-between;

  line-height: 45px
}
.reset-btn {
  cursor: pointer;
  padding: 0 10px;
  &:hover {
    background-color: #1a1a1a;
  }
}
</style>