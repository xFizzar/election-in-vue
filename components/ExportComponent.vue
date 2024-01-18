<script setup lang="ts">

const emit = defineEmits(["exportVotes", "exportBallotPapers"])


</script>

<template>
  <div id="buttons">
    <button @click="emit('exportVotes')">
      <Icon name="ph:export-bold" size="20"/>
      Export Votes
    </button>
    <button @click="emit('exportBallotPapers')">
      <Icon name="ph:export-bold" size="20"/>
      Export Ballot Papers
    </button>
  </div>
</template>

<style scoped>
* {
  font-family: Bahnschrift, serif;
}

#buttons {
  width: 60%;
  border: black 2px solid;
  border-radius: 20px;
  padding: 20px 20px;

  margin: 20px;

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