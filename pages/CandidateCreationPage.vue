<script setup lang="ts">

import type {Candidate, CandidateData} from "~/utils/Types";
import {useCandidateStore} from "~/store/CandidateStore";

const candidateStore = useCandidateStore();
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

let disabled = computed(() => {
  return candidateStore.candidates.length < 2;
})

</script>

<template>

  <div id="mainContainer">
    <div id="everything">
      <div id="inputContainer">
        <InputComponent @add-candidate="args => addCandidate(args)"/>
        <br>
        <button id="toNextPage" :disabled="disabled">
          <NuxtLink to="/VotingPage" :class="{disabled: disabled}">Start Vote</NuxtLink>
        </button>
        <br>
        <br>
        <import-settings-component
            @handleFileChange="handleFileChange"
            @importData="importData"></import-settings-component>


      </div>
      <CandidateList :show-invalid-candidate="false" :show-delete-button="true" :hide-points="true"
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