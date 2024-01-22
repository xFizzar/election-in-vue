<script setup lang="ts">
import type { Candidate } from "~/utils/Types";

const props = defineProps<{
  candidate: Candidate;
  twoPointsDisabled: boolean;
  onePointDisabled: boolean;
  bothClickable: boolean;
}>();

const emit = defineEmits(["selected2", "selected1"]);

function clickedOnOnePoint() {
  emit("selected1");
}

function clickedOnTwoPoints() {
  emit("selected2");
}
</script>

<template>
  <div id="candidateContainer">
    <span
      >{{ candidate.c_id }}: {{ candidate.name }} {{ candidate.class }}</span
    >

    <span
      >Punkte: {{ candidate.points }}; Erststimmen:
      {{ candidate.firstVotes }}</span
    >
    <div id="inputs">
      <span
        >Erststimme:
        <input
          type="checkbox"
          id="firstVote"
          :disabled="
            (twoPointsDisabled && !candidate.twoPointChecked) ||
            (!bothClickable && candidate.onePointChecked)
          "
          @click="clickedOnTwoPoints"
          v-model="candidate.twoPointChecked"
        />
      </span>

      <span
        >Zweitstimme:
        <input
          type="checkbox"
          id="secondVote"
          :disabled="
            (onePointDisabled && !candidate.onePointChecked) ||
            (!bothClickable && candidate.twoPointChecked)
          "
          @click="clickedOnOnePoint"
          v-model="candidate.onePointChecked"
        />
      </span>
    </div>
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
</style>
