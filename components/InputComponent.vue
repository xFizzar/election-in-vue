<script setup lang="ts">

import type {CandidateData} from "~/utils/Types";
import {useCandidateStore} from "~/store/CandidateStore";
import {useLocalStorage} from "~/store/LocalStorage";


const candidateStore = useCandidateStore();
const localStorageStore = useLocalStorage();

let candidateName = ref("")
let candidateClass = ref("")

function addCandidate(args: CandidateData) {
  if (args.name === "" || args.class === "") {
    alert("Invalid Data!");
    return;
  }
  candidateStore.addCandidate({
    c_id: 0,
    name: args.name,
    class: args.class,
    firstVotes: 0,
    points: 0,
    onePointChecked: false,
    twoPointChecked: false
  });

  candidateName.value = "";
  candidateClass.value = "";

  localStorageStore.updateLocalStorage();
}

</script>

<template>
  <form onsubmit="return false" @submit="addCandidate({name: candidateName, class: candidateClass})">
    <div id="inputs">
      <span>Input a new candidate: </span>
      <br>
      <label>Candidate Name: </label>
      <input placeholder="Candidate Name" v-model="candidateName">
      <br>
      <label>Candidate Class: </label>
      <input placeholder="Class" v-model="candidateClass">
      <button type="submit" id="addButton">
        <Icon name="material-symbols:add-box" size="32"></Icon>
      </button>
    </div>
  </form>
</template>

<style scoped>
#inputs {
  width: 60%;
  border: black 2px solid;
  border-radius: 20px;
  padding: 20px 20px 5px;

  display: flex;
  flex-direction: column;
}

#addButton {
  background: transparent;
  border: 0;
  margin: 5px;
  cursor: pointer;
}

#addButton:disabled {
  cursor: default;
}
</style>