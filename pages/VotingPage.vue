<script setup lang="ts">

import {useCandidateStore} from "~/store/CandidateStore";
import {useBallotPaperStore} from "~/store/BallotStore";
import type {BallotPaper, Candidate} from "~/utils/Types";
import {useKeypress} from "vue3-keypress";
import BallotPaperList from "~/components/BallotPaperList.vue";

const candidateStore = useCandidateStore();
const ballotStore = useBallotPaperStore();

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

function addPoints() {
  candidateFirstChecked.punkte++;

  candidateSecondChecked.punkte += 2;
  candidateSecondChecked.platz1++;
}

function setBallotPaperInvalid(paper: any) {
  paper.invalid = true;
}

function changingModeActive() {
  return changingBallotPaper.value.id != undefined;
}

function enterVote() {
  if (candidateFirstChecked === candidateStore.invalid_candidate && candidateSecondChecked === candidateStore.invalid_candidate) {
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

  candidateFirstChecked = candidateStore.invalid_candidate;
  candidateSecondChecked = candidateStore.invalid_candidate;

  changingBallotPaper.value = {} as BallotPaper;
}

function selectedOnePoint(candidate: Candidate) {
  onePointDisabled.value = !onePointDisabled.value;
  // onePointDisabled.value = !candidate.onePointChecked;
  onePointDisabled ? candidateFirstChecked = candidate : candidateFirstChecked = candidateStore.invalid_candidate;
}

function selectedTwoPoints(candidate: Candidate) {
  twoPointsDisabled.value = !twoPointsDisabled.value;
  // twoPointsDisabled.value = !candidate.twoPointChecked;
  twoPointsDisabled ? candidateSecondChecked = candidate : candidateSecondChecked = candidateStore.invalid_candidate;
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

// Just temporary in here
// then separate for SRP


let onePointDisabled = ref(false);
let twoPointsDisabled = ref(false);

let candidateFirstChecked: Candidate = candidateStore.invalid_candidate;
let candidateSecondChecked: Candidate = candidateStore.invalid_candidate;

let changingBallotPaper = ref({} as BallotPaper);

let voteReady = computed(() => {
  return (twoPointsDisabled.value || onePointDisabled.value);
});

</script>

<template>
  <div id="mainContainer">
    <div id="headerContainer">
      <h1>Current action:</h1>
      <h1>{{
          changingBallotPaper.id != undefined ? "Changing Paper with number: " + changingBallotPaper.number : "Voting"
        }}</h1>
      <h3>Valid Votes: {{ ballotStore.getValidVoteCount }}</h3>
      <h3>Total Votes: {{ ballotStore.getTotalVoteCount }}</h3>

      <button>
        <NuxtLink to="/ExportPage">End vote</NuxtLink>
      </button>
    </div>

    <CandidateList :only-show="false" :show-invalid-candidate="true" :one-point-disabled="onePointDisabled"
                   :two-points-disabled="twoPointsDisabled"
                   :show-delete-button="false" @selectedOnePoint="(args) => selectedOnePoint(args)"
                   @selectedTwoPoints="(args) => selectedTwoPoints(args)"/>


  </div>
  <button @click="enterVote" id="voteButton" :disabled="!voteReady">
    <Icon name="material-symbols:how-to-vote" size="20"/>
    Vote
  </button>
  <ballot-paper-list @change="args => changePaper(args)" :hide-irrelevant-things="false"></ballot-paper-list>
</template>

<style scoped>

</style>