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




</script>

<template>
  <div id="buttons">
    <button @click="exportVotes">
      <Icon name="ph:export-bold" size="20"/>
      Export Votes
    </button>
    <button @click="exportBallotPapers">
      <Icon name="ph:export-bold" size="20"/>
      Export Ballot Papers
    </button>
  </div>
</template>

<style scoped>
* {
  font-family: Bahnschrift, serif;
}

#buttons {
  width: 60%;
  border: black 2px solid;
  border-radius: 20px;
  padding: 20px 20px;

  margin: 20px;

  display: flex;
  flex-direction: column;
}
</style>