<script setup lang="ts">


import type {BallotPaper} from "~/utils/Types";
import {useCandidateStore} from "~/store/CandidateStore";

const props = defineProps<{
  data: BallotPaper,
  hideIrrelevantThings: boolean,
}>()

const candidateStore = useCandidateStore();

const emit = defineEmits(["change"])

function setPaperInvalid() {
  props.data.invalid = true;
  if (props.data.firstCandidate != undefined) {
    const firstCand = candidateStore.getByID(props.data.firstCandidate.c_id);
    if (firstCand !== undefined) {
      firstCand.points--;
    }

  }
  if (props.data.secondCandidate != undefined) {
    const secondCand = candidateStore.getByID(props.data.secondCandidate.c_id);
    if (secondCand !== undefined) {
      secondCand.points -= 2;
      secondCand.firstVotes--;
    }
  }

  localStorage.updateLocalStorage();

}

function change(data: BallotPaper) {
  changing.value = true;
  emit("change", data)
}

let changing = ref(false);

</script>

<template>
  <div id="ballotContainer" :class="{invalid: data.invalid}">
    <div v-if="!hideIrrelevantThings">
      <button @click="setPaperInvalid"
              id="invalidButton"
              :disabled="data.invalid || changing">
        <Icon name="material-symbols:disabled-by-default" size="25"></Icon>
      </button>
    </div>
    <span>ID: {{ data.id }}</span>
    <span>Number: {{ data.number }}</span>
    <span>Erststimme: {{
        data.secondCandidate ? data.secondCandidate.name : 'niemand'
      }} {{ data.secondCandidate ? data.secondCandidate.class : '' }}</span>
    <span>Zweitstimme: {{
        data.firstCandidate ? data.firstCandidate.name : 'niemand'
      }} {{ data.firstCandidate ? data.firstCandidate.class : '' }}</span>

    <div v-if="!hideIrrelevantThings">
      <button id="changeButton" @click="change(data)" :disabled="data.invalid">
        <Icon name="material-symbols:edit" size="20"/>
        Change
      </button>
    </div>
  </div>
</template>

<style scoped>
* {
  font-family: Bahnschrift, serif;
}

#ballotContainer {
  text-align: center;
  border: black 2px solid;
  margin: 10px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;

  align-items: center;
}

#changeButton {
  margin: 5px;
  display: block;
  text-align: center;
  background-color: transparent;
  cursor: pointer;

  border-radius: 10px;

  align-self: center;
}

#invalidButton {
  display: block;
  text-align: center;
  border: 0;
  background-color: transparent;
  cursor: pointer;
}

.invalid {
  border-color: red !important;
}

</style>