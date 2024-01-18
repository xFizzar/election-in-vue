<script setup lang="ts">

import {useCandidateStore} from "~/store/CandidateStore";

const candidateStore = useCandidateStore();

const props = defineProps<{
  showDeleteButton: boolean,
  showInvalidCandidate: boolean,
  onePointDisabled: boolean,
  twoPointsDisabled: boolean,
  hidePoints: boolean,
  hideVotingOptions: boolean,
}>()

const emit = defineEmits(["selectedOnePoint", "selectedTwoPoints", "delete"])

</script>

<template>

  <candidate-component v-if="showInvalidCandidate"
                       :candidate="candidateStore.invalid_candidate"
                       :show-delete-button="false"
                       @selected1="emit('selectedOnePoint', candidateStore.invalid_candidate)"
                       @selected2="emit('selectedTwoPoints', candidateStore.invalid_candidate)"
                       :one-point-disabled="onePointDisabled"
                       :two-points-disabled="twoPointsDisabled"
                       :both-clickable="true"
                       :hide-voting-options="hideVotingOptions"
                       :hide-points="hidePoints"/>

  <div id="candidateListContainer">
    <candidate-component v-for="candidate in candidateStore.candidates"
                         :candidate="candidate"
                         :show-delete-button="showDeleteButton"
                         @delete="args => emit('delete', args)"
                         @selected1="emit('selectedOnePoint', candidate)"
                         @selected2="emit('selectedTwoPoints', candidate)"
                         :one-point-disabled="onePointDisabled"
                         :two-points-disabled="twoPointsDisabled"
                         :both-clickable="false"
                         :hide-points="hidePoints"
                         :hide-voting-options="hideVotingOptions"/>
  </div>

</template>

<style scoped>

#candidateListContainer {
  height: 61vh;
  overflow: scroll;
  overflow-x: hidden;
}

</style>