<script setup lang="ts">


import type {BallotPaper} from "~/utils/Types";

const props = defineProps<{
  data: BallotPaper
}>()

const emit = defineEmits(["change"])

function setPaperInvalid() {
  props.data.invalid = true;
  if (props.data.firstCandidate != undefined) {
    props.data.firstCandidate.punkte--;
  }
  if (props.data.secondCandidate != undefined) {
    props.data.secondCandidate.punkte -= 2;
    props.data.secondCandidate.platz1--;
  }

}

</script>

<template>
  <div id="ballotContainer" :class="{invalid: data.invalid}">
    <button @click="setPaperInvalid"
            id="invalidButton"
            :disabled="data.invalid">
      <Icon name="material-symbols:disabled-by-default" size="25"></Icon>
    </button>
    <span>ID: {{ data.id }}</span>
    <span>Number: {{ data.number }}</span>
    <span>Erststimme: {{
        data.secondCandidate ? data.secondCandidate.name : 'niemand'
      }} {{ data.secondCandidate ? data.secondCandidate.klasse : '' }}</span>
    <span>Zweitstimme: {{
        data.firstCandidate ? data.firstCandidate.name : 'niemand'
      }} {{ data.firstCandidate ? data.firstCandidate.klasse : '' }}</span>

    <button id="changeButton" @click="emit('change', data)">
      <Icon name="material-symbols:edit" size="20"/>
      Change
    </button>
  </div>
</template>

<style scoped>

#ballotContainer {
  text-align: center;
  border: black 2px solid;
  margin: 10px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;

}

#changeButton {
  width: 30%;
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