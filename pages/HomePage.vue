<script setup lang="ts">

import {useCandidateStore} from "~/store/CandidateStore";
import type {Candidate, CandidateData} from "~/utils/Candidate";
import {useBallotPaperStore} from "~/store/BallotStore";
import type {BallotPaper} from "~/utils/BallotPaper";

const candidateStore = useCandidateStore();
const ballotStore = useBallotPaperStore();
callOnce(() => candidateStore.addExampleCandidate())

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

function enterVote() {
  if (!isVoteReady()) return;
  candidateStore.enterVotes(candidateFirstChecked, candidateSecondChecked);
  voteCount.value++;

  if (changingBallotPaper.value.id != undefined) {
    changingBallotPaper.value.invalid = true;

    changingBallotPaper.value = {} as BallotPaper;
  }

  ballotStore.addBallotPaper(candidateFirstChecked, candidateSecondChecked)



  resetVote();
}

function isVoteReady() {
  return onePointDisabled.value || twoPointsDisabled.value;
}

function resetVote() {
  onePointDisabled.value = false;
  twoPointsDisabled.value = false;
  candidateFirstChecked = undefined;
  candidateSecondChecked = undefined;
}

function selectedOnePoint(candidate: Candidate) {
  onePointDisabled.value = !onePointDisabled.value;
  onePointDisabled ? candidateFirstChecked = candidate : candidateFirstChecked = undefined;
}

function selectedTwoPoints(candidate: Candidate) {
  twoPointsDisabled.value = !twoPointsDisabled.value;
  twoPointsDisabled ? candidateSecondChecked = candidate : candidateSecondChecked = undefined;
}

function changePaper(paper: BallotPaper) {
  if (isVoteReady()) return;
  if (changingBallotPaper.value.id != undefined) return;

  changingBallotPaper.value = paper;

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

let onePointDisabled = ref(false);
let twoPointsDisabled = ref(false);

let candidateFirstChecked: Candidate | undefined;
let candidateSecondChecked: Candidate | undefined;

let voteCount = ref(0);

let changingBallotPaper = ref({} as BallotPaper);


</script>

<template>
  <div id="mainView">
    <div id="inputContainer">
      <InputComponent :vote-count="voteCount" @add-candidate="args => addCandidate(args)"></InputComponent>
    </div>
    <div id="candidateContainer">
      <div id="headerContainer">
        <h1>Current action:</h1>
        <h1>{{
            changingBallotPaper.id != undefined ? "Changing Paper with number: " + changingBallotPaper.number : "Voting"
          }}</h1>
      </div>

      <candidate-component v-for="candidate in candidateStore.candidates"
                           :vote-count="voteCount" :candidate="candidate"
                           @delete="args => deleteCandidate(args)"
                           @selected1="selectedOnePoint(candidate)"
                           @selected2="selectedTwoPoints(candidate)"
                           :one-point-disabled="onePointDisabled"
                           :two-points-disabled="twoPointsDisabled"></candidate-component>

      <button @click="enterVote" id="voteButton">
        <Icon name="material-symbols:how-to-vote" size="20"/>
        Vote
      </button>
    </div>
    <div id="ballotPaperContainer">
      <ballot-paper-candidate-component v-for="paper in ballotStore.ballotPapers"
                                        @change="args => changePaper(args)"
                                        :data="paper">

      </ballot-paper-candidate-component>
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
  border-radius: 10px;

  cursor: pointer;
}

#headerContainer {
  align-self: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

h1 {
  margin: 0;
}

</style>