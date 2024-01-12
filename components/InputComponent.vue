<script setup lang="ts">

const props = defineProps<{
  voteCount: number;
}>()

const emit = defineEmits(["addCandidate"]);

let candidateName: string;
let candidateClass: string;

</script>

<template>
  <div id="inputs">
    <span>Input a new candidate: </span>
    <br>
    <label>Candidate Name: </label>
    <input placeholder="Candidate Name" v-model="candidateName">
    <br>
    <label>Candidate Class: </label>
    <input placeholder="Class" v-model="candidateClass">
    <button @click="emit('addCandidate', {name: candidateName, klasse: candidateClass})" :disabled="voteCount > 0" id="addButton">
      <Icon name="material-symbols:add-box" size="32"></Icon>
    </button>
  </div>
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
#addButton{
  background: transparent;
  border: 0;
  margin: 5px;
  cursor: pointer;
}
#addButton:disabled{
  cursor: default;
}
</style>