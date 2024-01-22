<script setup lang="ts">

import {useCandidateStore} from "~/store/CandidateStore";
import {useBallotPaperStore} from "~/store/BallotStore";
import type {BallotPaper, Candidate} from "~/utils/Types";
import {useKeypress} from "vue3-keypress";
import BallotPaperList from "~/components/BallotPaperList.vue";
import {useLocalStorage} from "~/store/LocalStorage";

const candidateStore = useCandidateStore();
const ballotStore = useBallotPaperStore();
const localStorage = useLocalStorage();

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
  if (!voteReady.value) return;

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

  ballotStore.addBallotPaper(candidateFirstChecked, candidateSecondChecked, changingBallotPaper.value.number)

  resetVote();

  localStorage.updateLocalStorage();
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
    const firstCand = candidateStore.getByID(paper.firstCandidate.c_id);
    if (firstCand !== undefined) {
      selectedOnePoint(firstCand);
    }
  }
  if (paper.secondCandidate != undefined) {
    const secondCand = candidateStore.getByID(paper.secondCandidate.c_id);
    if (secondCand !== undefined) {
      selectedTwoPoints(secondCand);
    }
  }
}

function changePaper(paper: BallotPaper) {
  if (voteReady.value || changingModeActive()) return;

  changingBallotPaper.value = paper;

  loadStateFromBallotPaper(paper);
}


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

    <div id="listContainer">
      <div id="candidateList">
        <candidate-component-for-voting :candidate="candidateStore.invalid_candidate"
                                        @selected1="selectedOnePoint(candidateStore.invalid_candidate)"
                                        @selected2="selectedTwoPoints(candidateStore.invalid_candidate)"
                                        :one-point-disabled="onePointDisabled"
                                        :two-points-disabled="twoPointsDisabled"
                                        :both-clickable="true"/>

        <div id="candidateListContainer">
          <candidate-component-for-voting v-for="candidate in candidateStore.candidates"
                                          :key="candidate.c_id"
                                          :candidate="candidate"
                                          @selected1="selectedOnePoint(candidate)"
                                          @selected2="selectedTwoPoints(candidate)"
                                          :one-point-disabled="onePointDisabled"
                                          :two-points-disabled="twoPointsDisabled"
                                          :both-clickable="false"/>
        </div>
      </div>
      <div id="ballotList">
        <ballot-paper-list @change="args => changePaper(args)" :hide-irrelevant-things="false"
                           :change-allowed="!voteReady"/>
      </div>
    </div>

    <button @click="enterVote" id="voteButton" :disabled="!voteReady">
      <Icon name="material-symbols:how-to-vote" size="20"/>
      Vote
    </button>
  </div>

</template>

<style scoped>
* {
  font-family: Bahnschrift, serif;
}

#mainContainer {
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

#listContainer {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

#candidateListContainer {
  height: 61vh;
  overflow: scroll;
  overflow-x: hidden;
}


</style>