<script setup lang="ts">

const emit = defineEmits(["exportVotes", "exportBallotPapers", "handleFileChange", "importData"])

</script>

<template>
  <div id="settings">
    <button @click="emit('exportVotes')">Export Votes</button>
    <button @click="emit('exportBallotPapers')">Export Ballot Papers</button>
    <br>
    <input type="file" @change="emit('handleFileChange',$event)"/>
    <button @click="emit('importData')">Import Data</button>
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