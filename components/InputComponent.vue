<script setup lang="ts">

const props = defineProps<{
  voteStarted: boolean;
}>()

const emit = defineEmits(["addCandidate"]);

let candidateName = ref("")
let candidateClass = ref("")

function addCandidate() {
  emit('addCandidate', {name: candidateName.value, class: candidateClass.value})
  candidateName.value = "";
  candidateClass.value = "";
}

</script>

<template>
  <form onsubmit="return false" @submit="addCandidate">
    <div id="inputs">
      <span>Input a new candidate: </span>
      <br>
      <label>Candidate Name: </label>
      <input placeholder="Candidate Name" v-model="candidateName">
      <br>
      <label>Candidate Class: </label>
      <input placeholder="Class" v-model="candidateClass">
      <button type="submit" :disabled="voteStarted" id="addButton">
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