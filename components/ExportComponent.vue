<script setup lang="ts">

const emit = defineEmits(["exportVotes", "exportBallotPapers"])



</script>

<template>
  <button @click="emit('exportVotes')">Export Votes</button>
  <button @click="emit('exportBallotPapers')">Export Ballot Papers</button>
</template>

<style scoped>

</style>