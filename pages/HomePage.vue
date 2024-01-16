<script setup lang="ts">

import {useCandidateStore} from "~/store/CandidateStore";
import {useBallotPaperStore} from "~/store/BallotStore";
import {useKeypress} from "vue3-keypress";
import type {BallotPaper, Candidate, CandidateData} from "~/utils/Types";
import * as fs from "fs";

const candidateStore = useCandidateStore();
const ballotStore = useBallotPaperStore();
callOnce(() => candidateStore.addExampleCandidate())

const invalidCandidate = ref({
  c_id: 0,
  name: "ungültige Stimme",
  klasse: "",
  punkte: 0,
  platz1: 0,
  twoPointChecked: false,
  onePointChecked: false,
} as Candidate)

useKeypress({
      keyEvent: "keydown",
      keyBinds: [
        {
          keyCode: "enter",
          success: enterVote,
          preventDefault: false,
        }
      ]
    }
)

function addCandidate(args: CandidateData) {
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

function addPoints() {
  candidateFirstChecked.punkte++;

  candidateSecondChecked.punkte += 2;
  candidateSecondChecked.platz1++;
}

function setBallotPaperInvalid() {
  changingBallotPaper.value.invalid = true;
}

function changingModeActive() {
  return changingBallotPaper.value.id != undefined;
}

function enterVote() {
  addPoints();

  if (changingModeActive()) {
    setBallotPaperInvalid();
  }

  ballotStore.addBallotPaper(candidateFirstChecked, candidateSecondChecked)

  resetVote();
}

function resetVote() {
  onePointDisabled.value = false;
  twoPointsDisabled.value = false;

  candidateFirstChecked.onePointChecked = false;
  candidateSecondChecked.twoPointChecked = false;

  candidateFirstChecked = invalidCandidate.value;
  candidateSecondChecked = invalidCandidate.value;

  changingBallotPaper.value = {} as BallotPaper;
}

function selectedOnePoint(candidate: Candidate) {
  setVoteStarted()
  onePointDisabled.value = !onePointDisabled.value;
  // onePointDisabled.value = !candidate.onePointChecked;
  onePointDisabled ? candidateFirstChecked = candidate : candidateFirstChecked = invalidCandidate.value;
}

function selectedTwoPoints(candidate: Candidate) {
  setVoteStarted()
  twoPointsDisabled.value = !twoPointsDisabled.value;
  // twoPointsDisabled.value = !candidate.twoPointChecked;
  twoPointsDisabled ? candidateSecondChecked = candidate : candidateSecondChecked = invalidCandidate.value;
}

function setVoteStarted() {
  !voteStarted.value ? voteStarted.value = true : undefined;
}

function loadStateFromBallotPaper(paper: BallotPaper) {

  if (paper.firstCandidate != undefined) {
    paper.firstCandidate.onePointChecked = true;
    selectedOnePoint(paper.firstCandidate);
    paper.firstCandidate.punkte--;
  }
  if (paper.secondCandidate != undefined) {
    paper.secondCandidate.twoPointChecked = true;
    selectedTwoPoints(paper.secondCandidate)
    paper.secondCandidate.punkte -= 2;
    paper.secondCandidate.platz1--;
  }
}

function changePaper(paper: BallotPaper) {
  if (voteReady.value || changingModeActive()) return;

  changingBallotPaper.value = paper;

  loadStateFromBallotPaper(paper);
}


let onePointDisabled = ref(false);
let twoPointsDisabled = ref(false);

let candidateFirstChecked: Candidate = invalidCandidate.value;
let candidateSecondChecked: Candidate = invalidCandidate.value;

let changingBallotPaper = ref({} as BallotPaper);

let voteReady = computed(() => {
  return (twoPointsDisabled.value || onePointDisabled.value);
});
let voteStarted = ref(false);


// Just temporary in here
// then separate for SRP

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

  copy.splice(0, 0, invalidCandidate.value);

  downloadJsonFile("votes.json", copy);
}

function exportBallotPapers() {
  downloadJsonFile("ballotPapers.json", ballotStore.ballotPapers);
}

function handleFileChange(event: any) {
  selectedFile = event.target.files[0];
}

function importData() {
  if (selectedFile) {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        const importedData = JSON.parse(reader.result);
        console.log(importedData)
      }
    };
    reader.readAsText(selectedFile);
  } else {
    console.error('No file selected');
  }

}

let selectedFile: File;

</script>

<template>
  <div id="mainView">
    <div id="inputContainer">
      <InputComponent :vote-started="voteStarted" @add-candidate="args => addCandidate(args)"></InputComponent>
      <button @click="exportVotes">Export Votes</button>
      <button @click="exportBallotPapers">Export Ballot Papers</button>
      <br>
      <input type="file" @change="handleFileChange($event)"/>
      <button @click="importData">Import Data</button>
    </div>
    <div id="candidateContainer">
      <div id="headerContainer">
        <h1>Current action:</h1>
        <h1>{{
            changingBallotPaper.id != undefined ? "Changing Paper with number: " + changingBallotPaper.number : "Voting"
          }}</h1>
        <h3>Valid Votes: {{ ballotStore.getValidVoteCount }}</h3>
        <h3>Total Votes: {{ ballotStore.getTotalVoteCount }}</h3>
      </div>

      <candidate-component :candidate="invalidCandidate"
                           :vote-started="true"
                           :show-delete-button="false"
                           @selected1="selectedOnePoint(invalidCandidate)"
                           @selected2="selectedTwoPoints(invalidCandidate)"
                           :one-point-disabled="onePointDisabled"
                           :two-points-disabled="twoPointsDisabled"
                           :both-clickable="true"/>

      <div id="candidateListContainer">
        <candidate-component v-for="candidate in candidateStore.candidates"
                             :vote-started="voteStarted" :candidate="candidate"
                             :show-delete-button="true"
                             @delete="args => deleteCandidate(args)"
                             @selected1="selectedOnePoint(candidate)"
                             @selected2="selectedTwoPoints(candidate)"
                             :one-point-disabled="onePointDisabled"
                             :two-points-disabled="twoPointsDisabled"
                             :both-clickable="false"/>
      </div>
      <button @click="enterVote" id="voteButton" :disabled="!voteReady">
        <Icon name="material-symbols:how-to-vote" size="20"/>
        Vote
      </button>
    </div>
    <div id="ballotPaperContainer">
      <ballot-paper-candidate-component v-for="paper in ballotStore.getReversedBallotPapers"
                                        @change="args => changePaper(args)"
                                        :data="paper"/>
    </div>
  </div>

</template>

<style scoped>
* {
  font-family: Bahnschrift, serif;
}

#mainView {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}

#inputContainer {
  width: 60%;
  padding: 10px;
  justify-self: center;
}

#candidateContainer {
  display: flex;
  flex-direction: column;

}

#voteButton {
  width: 30%;
  font-size: large;
  align-self: center;

  padding: 10px;
  margin: 10px;
  border-radius: 10px;

  cursor: pointer;
}

#voteButton:disabled {
  cursor: default;
}

#headerContainer {
  align-self: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

h1, h3 {
  margin: 0;
}

#ballotPaperContainer {
  height: 95vh;
  overflow: scroll;
  overflow-x: hidden;
}

#candidateListContainer {
  height: 60vh;
  overflow: scroll;
  overflow-x: hidden;
}

#candidateListContainer::-webkit-scrollbar {
  //display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
#candidateListContainer {
  //-ms-overflow-style: none; /* IE and Edge */
  //scrollbar-width: none; /* Firefox */
}

</style>