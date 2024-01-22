<script setup lang="ts">

import {useCandidateStore} from "~/store/CandidateStore";
import {useBallotPaperStore} from "~/store/BallotStore";

const candidateStore = useCandidateStore();
const ballotStore = useBallotPaperStore();


function downloadJsonFile(filename: string, data: any[]) {

  const Json = JSON.stringify(data, null, 2);

  const blob = new Blob([Json], {type: 'application/json'})

  const link = document.createElement('a');

  // Set the link's attributes
  link.href = URL.createObjectURL(blob);
  link.download = filename;

  // Trigger the click event on the link to start the download
  link.click();
}

function exportVotes() {
  const copy = [...candidateStore.candidates];

  copy.splice(0, 0, candidateStore.invalid_candidate);

  downloadJsonFile("votes.json", copy);
}

function exportBallotPapers() {
  downloadJsonFile("ballotPapers.json", ballotStore.ballotPapers);
}

function returnToHomePage() {
  candidateStore.$reset();
  ballotStore.$reset();
  localStorage.clear()
}

</script>

<template>

  <div id="listContainer">
    <div>
      <candidate-component-for-results :candidate="candidateStore.invalid_candidate"/>

      <div id="candidateListContainer">
        <candidate-component-for-results v-for="candidate in candidateStore.candidates"
                                         :key="candidate.c_id"
                                         :candidate="candidate"/>
      </div>
    </div>

    <BallotPaperList :hide-irrelevant-things="true"></BallotPaperList>


  </div>
  <div id="exportContainer">
    <ExportComponent @exportVotes="exportVotes" @exportBallotPapers="exportBallotPapers"/>
    <NuxtLink to="/" @click="returnToHomePage" id="returnHomeButton">Return to home</NuxtLink>
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


</style>