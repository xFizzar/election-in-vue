<script setup lang="ts">

import type {Candidate, CandidateData} from "~/utils/Types";
import {useCandidateStore} from "~/store/CandidateStore";
import {useBallotPaperStore} from "~/store/BallotStore";
import {useLocalStorage} from "~/store/LocalStorage";

const candidateStore = useCandidateStore();
const ballotPaperStore = useBallotPaperStore();
const localStorageStore = useLocalStorage();
callOnce(() => candidateStore.addExampleCandidate())

function addCandidate(args: CandidateData) {
  if (args.name === "" || args.klasse === "") {
    alert("Invalid Data!");
    return;
  }
  candidateStore.addCandidate({
    c_id: 0,
    name: args.name,
    klasse: args.klasse,
    platz1: 0,
    punkte: 0,
    onePointChecked: false,
    twoPointChecked: false
  });
}

function deleteCandidate(candidate: Candidate) {
  candidateStore.deleteCandidate(candidate);
}

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

  if (storedCandidates && storedBallots) {
    candidateStore.candidates = JSON.parse(storedCandidates);
    ballotPaperStore.ballotPapers = JSON.parse(storedBallots);

  } else {
    console.log("Could not load");
  }
}

let candidateFile: File;
let ballotFile: File;

let disabledLink = computed(() => {
  return candidateStore.candidates.length < 2;
})

</script>

<template>

  <div id="mainContainer">
    <div id="everything">
      <div id="inputContainer">
        <InputComponent @add-candidate="args => addCandidate(args)"/>
        <br>
        <button id="toNextPage" :disabled="disabledLink">
          <NuxtLink to="/VotingPage" :class="{disabled: disabledLink}">Start Vote</NuxtLink>
        </button>
        <br>
        <br>
        <import-settings-component
            @loadFromLocalStorage="restore"
            @handleFileChangeCandidates="handleFileChangeCandidate"
            @handleFileChangeBallots="handleFileChangeBallots"
            @importData="importData"
        />


      </div>
      <CandidateList :show-invalid-candidate=" false
        " :show-delete-button="true" :hide-points="true"
                     :hide-voting-options="true" @delete="(args) => deleteCandidate(args)">
      </CandidateList>
    </div>

  </div>
</template>

<style scoped>
* {
  font-family: Bahnschrift, serif;
}

#inputContainer {
  width: 40%;
  float: left;
}

#mainContainer {
  height: 95vh;
  width: 95vw;
  display: flex;
  justify-content: center;
  align-items: center;
}

#everything {
  height: 90%;
  width: 60%;
}

.disabled {
  color: lightgray;
  pointer-events: none;
}

</style>