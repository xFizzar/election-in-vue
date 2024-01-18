<script setup lang="ts">
import {useBallotPaperStore} from "~/store/BallotStore";

const ballotStore = useBallotPaperStore();

const emit = defineEmits(["change"])

const props = defineProps<{
  hideIrrelevantThings: boolean
}>();

</script>

<template>
  <div id="ballotPaperContainer">
    <ballot-paper-candidate-component v-for="paper in ballotStore.getReversedBallotPapers" :key="paper.id"
                                      @change="args => emit('change', args)"
                                      :data="paper" :hide-irrelevant-things="hideIrrelevantThings"/>
  </div>
</template>

<style scoped>
#ballotPaperContainer {
  height: 72vh;
  overflow: scroll;
  overflow-x: hidden;
}
</style>