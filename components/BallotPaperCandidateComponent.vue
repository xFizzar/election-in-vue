<script setup lang="ts">

import type {BallotPaper} from "~/utils/BallotPaper";

const props = defineProps<{
  data: BallotPaper
}>()

const emit = defineEmits(["change"])

</script>

<template>
  <div id="ballotContainer">
    <span>{{ data.id }}</span>
    <span>Erststimme: {{ data.secondCandidate ? data.secondCandidate.name : 'niemand' }} {{ data.secondCandidate ? data.secondCandidate.klasse : '' }}</span>
    <span>Zweitstimme: {{ data.firstCandidate ? data.firstCandidate.name : 'niemand' }} {{ data.firstCandidate ? data.firstCandidate.klasse : '' }}</span>

    <button id="changeButton" @click="emit('change', data)">
      <Icon name="material-symbols:edit" size="20"/>
      Change
    </button>
  </div>
</template>

<style scoped>

#ballotContainer {
  text-align: center;
  border: black 2px solid;
  margin: 10px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;

}

#changeButton {
  width: 30%;
  margin: 5px;
  display: block;
  text-align: center;
  background-color: transparent;
  cursor: pointer;

  border-radius: 10px;

  align-self: center;
}

#voteButton {
  width: 30%;
  font-size: large;
  align-self: center;

  padding: 10px;
  border-radius: 10px;

  cursor: pointer;
}

</style>