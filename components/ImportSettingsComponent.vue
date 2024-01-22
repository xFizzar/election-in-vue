<script setup lang="ts">

import type {Candidate} from "~/utils/Types";
import {useCandidateStore} from "~/store/CandidateStore";
import {useBallotPaperStore} from "~/store/BallotStore";
import {useLocalStorage} from "~/store/LocalStorage";

const candidateStore = useCandidateStore();
const ballotPaperStore = useBallotPaperStore();
const localStorageStore = useLocalStorage();

function handleFileChangeCandidate(event: any) {
  candidateFile = event.target.files[0];
}

function handleFileChangeBallots(event: any) {
  ballotFile = event.target.files[0];
}

function importData() {
  if (candidateFile && ballotFile) {
    const readerCandidate = new FileReader();
    const readerBallotPaper = new FileReader();

    // Reading candidateFile
    readerCandidate.onload = () => {
      if (typeof readerCandidate.result === "string") {
        const candidateArray = JSON.parse(readerCandidate.result) as Candidate[];
        const invalidCand = candidateArray.splice(candidateArray.findIndex(value => value.c_id == 0), 1)
        candidateStore.candidates = candidateArray;
        candidateStore.invalid_candidate = invalidCand[0];
        localStorageStore.updateCandidates();
      }
    };

    // Reading ballotPaperFile
    readerBallotPaper.onload = () => {
      if (typeof readerBallotPaper.result === "string") {
        ballotPaperStore.ballotPapers = JSON.parse(readerBallotPaper.result);
        localStorageStore.updateBallots();
      }
    };

    readerCandidate.readAsText(candidateFile);
    readerBallotPaper.readAsText(ballotFile);
  } else {
    console.error("No file selected");
  }

}

function restore() {
  const storedCandidates = localStorage.getItem("candidates");
  const storedBallots = localStorage.getItem("ballots");
  const storedInvalidCandidate = localStorage.getItem("invalid_candidate")

  if (storedCandidates && storedBallots && storedInvalidCandidate) {
    candidateStore.candidates = JSON.parse(storedCandidates);
    ballotPaperStore.ballotPapers = JSON.parse(storedBallots);
    candidateStore.invalid_candidate = JSON.parse(storedInvalidCandidate)

  } else {
    console.log("Could not load");
  }
}

let candidateFile: File;
let ballotFile: File;

</script>

<template>
  <div id="settings">
    <button @click="restore">Load from local Storage</button>
    <br>
    <span>Candidates: </span><input type="file" @change="handleFileChangeCandidate($event)"/>
    <span>Ballots: </span><input type="file" @change="handleFileChangeBallots($event)">
    <button @click="importData">
      <Icon name="pajamas:import" size="20"/>
      Import Data
    </button>
  </div>

</template>

<style scoped>
#settings {
  width: 60%;
  border: black 2px solid;
  border-radius: 20px;
  padding: 20px;

  display: flex;
  flex-direction: column;
}
</style>