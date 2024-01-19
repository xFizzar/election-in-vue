<script setup lang="ts">

const emit = defineEmits(["exportVotes", "exportBallotPapers", "handleFileChangeCandidates", "handleFileChangeBallots", "importData", "loadFromLocalStorage"])

</script>

<template>
  <div id="settings">
    <button @click="emit('loadFromLocalStorage')">Load from local Storage</button>
    <br>
    <span>Candidates: </span><input type="file" @change="emit('handleFileChangeCandidates',$event)"/>
    <span>Ballots: </span><input type="file" @change="emit('handleFileChangeBallots', $event)">
    <button @click="emit('importData')">
      <Icon name="pajamas:import" size="20"/>
      Import Data
    </button>
  </div>

</template>

<style scoped>
#settings {
  width: 60%;
  border: black 2px solid;
  border-radius: 20px;
  padding: 20px;

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