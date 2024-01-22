<script setup lang="ts">

import type {Candidate} from "~/utils/Types";

const props = defineProps<{
  candidate: Candidate,
}>()

</script>

<template>
  <div id="candidateContainer">

    <span>{{ candidate.c_id }}: {{ candidate.name }} {{ candidate.class }}</span>

    <span>Punkte: {{ candidate.points }}; Erststimmen: {{ candidate.firstVotes }}</span>
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