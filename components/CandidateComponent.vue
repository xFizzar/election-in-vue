<script setup lang="ts">


import type {Candidate} from "~/utils/Types";

const props = defineProps<{
  candidate: Candidate,
  twoPointsDisabled: boolean,
  onePointDisabled: boolean,
  voteStarted: boolean,
  showDeleteButton: boolean;
}>()

const emit = defineEmits(["delete", "selected2", "selected1"])

function clickedOnOnePoint() {
  emit("selected1");
}

function clickedOnTwoPoints() {
  emit("selected2")
}

</script>

<template>
  <div id="candidateContainer">


    <button v-if="showDeleteButton" @click="emit('delete', candidate)"
            :disabled="voteStarted" id="deleteButton">
      <Icon name="material-symbols:delete-forever" size="25"></Icon>
    </button>
    <span>{{ candidate.c_id }}: {{ candidate.name }} {{ candidate.klasse }}</span>
    <span>Punkte: {{ candidate.punkte }}; Erststimmen: {{ candidate.platz1 }}</span>

    <span>Erststimme:
    <input type="checkbox" :disabled="(twoPointsDisabled && !candidate.twoPointChecked) || candidate.onePointChecked"
           @click="clickedOnTwoPoints"
           v-model="candidate.twoPointChecked">
    </span>

    <span>Zweitstimme:
    <input type="checkbox" :disabled="(onePointDisabled && !candidate.onePointChecked) || candidate.twoPointChecked"
           @click="clickedOnOnePoint"
           v-model="candidate.onePointChecked">
      </span>
  </div>

</template>

<style scoped>
* {
  font-family: Bahnschrift, serif;
}

#candidateContainer {
  text-align: center;
  border: black 2px solid;
  margin: 10px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  padding: 5px;

}

#deleteButton {
  display: block;
  text-align: center;
  border: 0;
  background-color: transparent;
  cursor: pointer;
}

#deleteButton:disabled {
  cursor: default;
}

</style>