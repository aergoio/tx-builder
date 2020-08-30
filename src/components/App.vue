<template lang="pug">
  .app
    router-view
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component
export default class App extends Vue {
  mounted() {
    this.$store.dispatch('setChain', { nodeUrl: 'https://testnet-api-http.aergo.io' });
    if (this.$route.params.address) {
      this.$store.dispatch('setContractAddress', { address: `${this.$route.params.address}` });
    }
  }
}
</script>

<style lang="scss">
body {
  height: 100vh;
  margin: 0;
  padding: 0;
  font-family: sans-serif;
  background-color: #242424;
  color: #fff;
  font-size: 14px;
}

.app {
  height: 100%;
  position: relative;
}

p {
  margin: 0 0 1em 0;
}
</style>