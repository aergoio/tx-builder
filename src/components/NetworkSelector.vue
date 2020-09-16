<template lang="html">
  <div class="network-selector" @click="selectNetwork">
    <Icon name="net" :size=20></Icon>
    <span class="chain-id">{{chainId}}</span>
    <span class="status" :class="`status-${status}`">
      <Icon name="checkmark" :size=20 v-show="consensus && !chainError"></Icon>
      <Icon name="danger" :size=20 v-show="chainError"></Icon>
      <span class="consensus-name" v-show="consensus && !chainError">{{consensus}}</span>
      <span class="consensus-name" v-show="chainError" :title="chainError">Connection failed</span>
      <span class="consensus-name" v-show="status == 'connecting'">Connecting...</span>
    </span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Icon } from './icons';

type ConnectionStatus = 'connecting' | 'connected' | 'error';

@Component({ components: { Icon, }})
export default class NetworkSelector extends Vue {
  get status(): ConnectionStatus {
    if (this.chainError) {
      return 'error';
    }
    if (this.consensus) {
      return 'connected';
    }
    return 'connecting';
  }

  get chainId() {
    return this.$store.state.chainId;
  }
  get chainInfo() {
    return this.$store.state.chainInfo;
  }
  get chainError() {
    return this.$store.state.chainError;
  }
  get consensus() {
    return this.$store.state.chainInfo?.chainid?.consensus;
  }

  selectNetwork() {
    const nodeUrl = prompt('Enter Aergo Node URL');
    if (nodeUrl) {
      this.$store.dispatch('setChain', { nodeUrl })
    }
  }
}
</script>

<style lang="scss">
.network-selector {
  cursor: pointer;
  padding: 0 10px;
  &:hover {
    background-color: #1a1a1a;
  }
  .chain-id {
    margin: 0 3px;
  }
  
  .status {
    line-height: 1em;
    border-radius: 12px;
    border: 1px solid #fff;
    display: inline-flex;
    align-items: center;
    padding: 0 8px 0 3px;
    color: #fff;
    line-height: 20px;
    &.status-connected {
      border-color: #00C789;
    }
    &.status-error {
      border-color: #EE4648;
    }
  }
  .consensus-name {
    text-transform: uppercase;
    font-size: .8em;
    opacity: .8;
  }
}
</style>