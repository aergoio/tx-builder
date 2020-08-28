<template lang="html">
  <div class="top-view">
    <TopBar></TopBar>
    <div class="builder-content">
      <h2>TX Builder</h2>
      <div class="view">
        <Builder></Builder>
      </div>
      <h2>Contract Query</h2>
      <div class="view">
        <Query></Query>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import TopBar from '../components/TopBar.vue';
import Builder from '../components/Builder.vue';
import Query from '../components/Query.vue';

@Component({ components: { TopBar, Builder, Query, }})
export default class BuilderView extends Vue {
}
</script>

<style lang="scss">
.builder-content {
  padding: 25px;
}
h2 {
  font-size: 0.8em;
  font-weight: normal;
  text-transform: uppercase;
  margin: 0 0 1em;
}
.view {
  background-color: #1f1f1f;
  margin-bottom: 25px;
}
</style>