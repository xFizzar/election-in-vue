<script setup lang="ts">

import {useCandidateStore} from "~/store/CandidateStore";
import {useBallotPaperStore} from "~/store/BallotStore";
import {useKeypress} from "vue3-keypress";
import type {BallotPaper, Candidate, CandidateData} from "~/utils/Types";

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
  if (candidateFirstChecked != undefined) {
    candidateFirstChecked.punkte++;
  }
  if (candidateSecondChecked != undefined) {
    candidateSecondChecked.punkte += 2;
    candidateSecondChecked.platz1++;
  }
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

  candidateFirstChecked !== undefined ? candidateFirstChecked.onePointChecked = false : null;
  candidateSecondChecked !== undefined ? candidateSecondChecked.twoPointChecked = false : null;

  candidateFirstChecked = undefined;
  candidateSecondChecked = undefined;

  changingBallotPaper.value = {} as BallotPaper;

}

function selectedOnePoint(candidate: Candidate) {
  setVoteStarted()
  onePointDisabled.value = !onePointDisabled.value;
  // onePointDisabled.value = !candidate.onePointChecked;
  onePointDisabled ? candidateFirstChecked = candidate : candidateFirstChecked = undefined;
}

function selectedTwoPoints(candidate: Candidate) {
  setVoteStarted()
  twoPointsDisabled.value = !twoPointsDisabled.value;
  // twoPointsDisabled.value = !candidate.twoPointChecked;
  twoPointsDisabled ? candidateSecondChecked = candidate : candidateSecondChecked = undefined;
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

let candidateFirstChecked: Candidate | undefined;
let candidateSecondChecked: Candidate | undefined;

let changingBallotPaper = ref({} as BallotPaper);

let voteReady = computed(() => {
  return (twoPointsDisabled.value || onePointDisabled.value);
});
let voteStarted = ref(false);


</script>

<template>
  <div id="mainView" @keydown.enter="enterVote">
    <div id="inputContainer">
      <InputComponent :vote-started="voteStarted" @add-candidate="args => addCandidate(args)"></InputComponent>
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
                           :two-points-disabled="twoPointsDisabled"/>

      <div id="candidateListContainer">
        <candidate-component v-for="candidate in candidateStore.candidates"
                             :vote-started="voteStarted" :candidate="candidate"
                             :show-delete-button="true"
                             @delete="args => deleteCandidate(args)"
                             @selected1="selectedOnePoint(candidate)"
                             @selected2="selectedTwoPoints(candidate)"
                             :one-point-disabled="onePointDisabled"
                             :two-points-disabled="twoPointsDisabled"/>
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