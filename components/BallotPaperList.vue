<script setup lang="ts">
import {useBallotPaperStore} from "~/store/BallotStore";

const ballotStore = useBallotPaperStore();

const emit = defineEmits(["change"])

const props = defineProps<{
  hideIrrelevantThings: boolean,
  changeAllowed: boolean,
}>();

</script>

<template>
  <div id="ballotPaperContainer">
    <ballot-paper-candidate-component v-for="paper in ballotStore.getReversedBallotPapers" :key="paper.id"
                                      @change="args => emit('change', args)"
                                      :data="paper" :hide-irrelevant-things="hideIrrelevantThings"
                                      :change-allowed="changeAllowed"/>
  </div>
</template>

<style scoped>
#ballotPaperContainer {
  height: 72vh;
  overflow: scroll;
  overflow-x: hidden;
}
</style>