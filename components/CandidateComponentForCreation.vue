<script setup lang="ts">

import type {Candidate} from "~/utils/Types";
import {useCandidateStore} from "~/store/CandidateStore";
import {useLocalStorage} from "~/store/LocalStorage";

const candidateStore = useCandidateStore();
const localStorageStore = useLocalStorage();

const props = defineProps<{
  candidate: Candidate,
}>()

function deleteCandidate() {
  candidateStore.deleteCandidate(props.candidate);
  localStorageStore.updateLocalStorage();
}

</script>

<template>
  <div id="candidateContainer">

    <button @click="deleteCandidate"
            id="deleteButton">
      <Icon name="material-symbols:delete-forever" size="25"></Icon>
    </button>
    <span>{{ candidate.c_id }}: {{ candidate.name }} {{ candidate.class }}</span>
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