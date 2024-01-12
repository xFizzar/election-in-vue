<script setup lang="ts">


import type {Candidate} from "~/utils/Types";

const props = defineProps<{
  candidate: Candidate,
  twoPointsDisabled: boolean,
  onePointDisabled: boolean,
  voteStarted: boolean
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


    <button @click="emit('delete', candidate)"
            :disabled="voteStarted" id="deleteButton">
      <Icon name="material-symbols:delete-forever" size="25"></Icon>
    </button>
    <span>{{ candidate.c_id }}</span>
    <span> {{ candidate.name }} {{ candidate.klasse }}</span>
    <span>Erststimmen: {{ candidate.platz1 }}</span>
    <span>Gesamtpunkte: {{ candidate.punkte }}</span>

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
    <br>
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