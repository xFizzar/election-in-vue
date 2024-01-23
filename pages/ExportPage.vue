<script setup lang="ts">
import { useCandidateStore } from "~/store/CandidateStore";
import { useBallotPaperStore } from "~/store/BallotStore";
import { useLocalStorage } from "~/store/LocalStorage";

const candidateStore = useCandidateStore();
const ballotStore = useBallotPaperStore();
const localStorageStore = useLocalStorage();

function returnToHomePage() {
  candidateStore.$reset();
  ballotStore.$reset();
  localStorageStore.updateLocalStorage();
}
</script>

<template>
  <div id="results">
    <h2>
      Winner(s):
      <span v-if="candidateStore.getWinner.length === 0">no winner</span>
      <span v-if="candidateStore.getWinner.length !== 0">
        <span v-for="(cand, index) in candidateStore.getWinner">
          {{ index > 0 ? ", " : ""}}{{ cand.name }}
        </span>
      </span>
    </h2>
  </div>
  <div id="listContainer">
    <div>
      <candidate-component-for-results
        :candidate="candidateStore.invalid_candidate"
      />

      <div id="candidateListContainer">
        <candidate-component-for-results
          v-for="candidate in candidateStore.candidates"
          :key="candidate.c_id"
          :candidate="candidate"
        />
      </div>
    </div>

    <BallotPaperList :hide-irrelevant-things="true"></BallotPaperList>
  </div>
  <div id="exportContainer">
    <ExportComponent />
    <NuxtLink to="/" @click="returnToHomePage" id="returnHomeButton"
      >Return to home
    </NuxtLink>
  </div>
</template>

<style scoped>
* {
  font-family: Bahnschrift, serif;
}

#listContainer {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

#exportContainer {
  width: 400px;
  margin-left: auto;
  margin-right: auto;

  display: flex;
  flex-direction: column;
  align-items: center;
}

#candidateListContainer {
  height: 61vh;
  overflow: scroll;
  overflow-x: hidden;
}

#results {
  text-align: center;
}
</style>
