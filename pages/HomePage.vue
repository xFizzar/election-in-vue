<script setup lang="ts">

import {useCandidateStore} from "~/store/CandidateStore";
import {useBallotPaperStore} from "~/store/BallotStore";
import {useKeypress} from "vue3-keypress";
import {currentAction} from "~/utils/CurrentAction";
import type {BallotPaper, Candidate, CandidateData} from "~/utils/Types";

const candidateStore = useCandidateStore();
const ballotStore = useBallotPaperStore();
callOnce(() => candidateStore.addExampleCandidate())

const invalidCandidate = ref({
  c_id: 0,
  name: "ungültige Stimme",
  class: "",
  points: 0,
  firstVotes: 0,
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
    class: args.klasse,
    firstVotes: 0,
    points: 0,
    onePointChecked: false,
    twoPointChecked: false
  });
}

function deleteCandidate(candidate: Candidate) {
  candidateStore.deleteCandidate(candidate);
}

function addPoints() {
  candidateFirstChecked.points++;

  candidateSecondChecked.points += 2;
  candidateSecondChecked.firstVotes++;
}

function setBallotPaperInvalid(paper: any) {
  paper.invalid = true;
}

function changingModeActive() {
  return changingBallotPaper.value.id != undefined;
}

function enterVote() {
  if (currentMode.value != currentAction.VOTING) return;

  if (candidateFirstChecked === invalidCandidate.value && candidateSecondChecked === invalidCandidate.value) {
    const paper = ballotStore.addBallotPaper(candidateFirstChecked, candidateSecondChecked);
    setBallotPaperInvalid(paper);
    if (changingModeActive()) {
      setBallotPaperInvalid(changingBallotPaper.value);
    }
    resetVote();
    return;
  }

  addPoints();

  if (changingModeActive()) {
    setBallotPaperInvalid(changingBallotPaper.value);
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
  onePointDisabled.value = !onePointDisabled.value;
  // onePointDisabled.value = !candidate.onePointChecked;
  onePointDisabled ? candidateFirstChecked = candidate : candidateFirstChecked = invalidCandidate.value;
}

function selectedTwoPoints(candidate: Candidate) {
  twoPointsDisabled.value = !twoPointsDisabled.value;
  // twoPointsDisabled.value = !candidate.twoPointChecked;
  twoPointsDisabled ? candidateSecondChecked = candidate : candidateSecondChecked = invalidCandidate.value;
}

function loadStateFromBallotPaper(paper: BallotPaper) {

  if (paper.firstCandidate != undefined) {
    paper.firstCandidate.onePointChecked = true;
    selectedOnePoint(paper.firstCandidate);
    paper.firstCandidate.points--;
  }
  if (paper.secondCandidate != undefined) {
    paper.secondCandidate.twoPointChecked = true;
    selectedTwoPoints(paper.secondCandidate)
    paper.secondCandidate.points -= 2;
    paper.secondCandidate.firstVotes--;
  }
}

function changePaper(paper: BallotPaper) {
  if (voteReady.value || changingModeActive()) return;

  changingBallotPaper.value = paper;

  loadStateFromBallotPaper(paper);
}

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

let onePointDisabled = ref(false);
let twoPointsDisabled = ref(false);

let candidateFirstChecked: Candidate = invalidCandidate.value;
let candidateSecondChecked: Candidate = invalidCandidate.value;

let changingBallotPaper = ref({} as BallotPaper);

let voteReady = computed(() => {
  return (twoPointsDisabled.value || onePointDisabled.value);
});

let selectedFile: File;

let currentMode = ref(currentAction.CREATING);

</script>

<template>
  <div id="mainView">
    <div id="inputContainer">
      <InputComponent @add-candidate="args => addCandidate(args)"
                      v-if="currentMode == currentAction.CREATING"/>
      <br>
      <button @click="currentMode = currentAction.VOTING">Start Vote</button>
      <button @click="currentMode = currentAction.EXPORTING">End Vote</button>
      <br>
      <br>
      <import-settings-component v-if="currentMode == currentAction.EXPORTING"
                                 @exportVotes="exportVotes"
                                 @exportBallotPapers="exportBallotPapers"
                                 @handleFileChange="handleFileChange"
                                 @importData="importData"></import-settings-component>
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
                           :show-delete-button="false"
                           @selected1="selectedOnePoint(invalidCandidate)"
                           @selected2="selectedTwoPoints(invalidCandidate)"
                           :one-point-disabled="onePointDisabled"
                           :two-points-disabled="twoPointsDisabled"
                           :both-clickable="true"/>

      <div id="candidateListContainer">
        <candidate-component v-for="candidate in candidateStore.candidates"
                             :candidate="candidate"
                             :show-delete-button="currentMode == currentAction.CREATING"
                             @delete="args => deleteCandidate(args)"
                             @selected1="selectedOnePoint(candidate)"
                             @selected2="selectedTwoPoints(candidate)"
                             :one-point-disabled="onePointDisabled"
                             :two-points-disabled="twoPointsDisabled"
                             :both-clickable="false"/>
      </div>
      <button @click="enterVote" id="voteButton" :disabled="!voteReady || currentMode != currentAction.VOTING">
        <Icon name="material-symbols:how-to-vote" size="20"/>
        Vote
      </button>
    </div>
    <div id="ballotPaperContainer" v-if="currentMode == currentAction.VOTING || currentMode == currentAction.EXPORTING">
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