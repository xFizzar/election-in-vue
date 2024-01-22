<script setup lang="ts">

import {useCandidateStore} from "~/store/CandidateStore";

const candidateStore = useCandidateStore();
callOnce(() => candidateStore.addExampleCandidate())


let disabledLink = computed(() => {
  return candidateStore.candidates.length < 2;
})

</script>

<template>

  <div id="mainContainer">
    <div id="everything">
      <div id="inputContainer">
        <InputComponent/>
        <br>
        <button id="toNextPage" :disabled="disabledLink">
          <NuxtLink to="/VotingPage" :class="{disabled: disabledLink}">Start Vote</NuxtLink>
        </button>
        <br>
        <br>
        <import-settings-component/>

      </div>

      <div id="candidateListContainer">
        <candidate-component-for-creation v-for="candidate in candidateStore.candidates"
                                          :key="candidate.c_id"
                                          :candidate="candidate"/>
      </div>
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

#candidateListContainer {
  height: 61vh;
  overflow: scroll;
  overflow-x: hidden;
}

</style>