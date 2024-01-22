import { defineStore } from "pinia";
import type { Candidate } from "~/utils/Types";

interface State {
  current_id: number;
  candidates: Candidate[];
  invalid_candidate: Candidate;
}

export const useCandidateStore = defineStore("logEntries", {
  state: (): State => ({
    current_id: 1,
    candidates: [],
    invalid_candidate: {
      c_id: 0,
      name: "ungültig",
      class: "",
      twoPointChecked: false,
      onePointChecked: false,
      points: 0,
      firstVotes: 0,
    },
  }),
  getters: {
    getWinner: (state) => getCandidateWithHighestPoints(state.candidates),
  },
  actions: {
    getByID(id: number): Candidate | undefined {
      if (id == 0) return this.invalid_candidate;
      return this.candidates.find((value) => value.c_id == id);
    },
    addCandidate(candidate: Candidate) {
      if (candidate == undefined) return;
      candidate.c_id = this.current_id;
      this.current_id++;
      this.candidates.push(candidate);
    },
    deleteCandidate(candidate: Candidate): Candidate {
      return this.candidates.splice(
        this.candidates.indexOf(candidate),
        1,
      ) as unknown as Candidate;
    },

    addExampleCandidate() {
      let cand: Candidate[] = [
        {
          c_id: 0,
          name: "Fabian Götz",
          class: "4AHIF",
          firstVotes: 0,
          points: 0,

          onePointChecked: false,
          twoPointChecked: false,
        },
        {
          c_id: 0,
          name: "Benedikt Huff",
          class: "4AHIF",
          firstVotes: 0,
          points: 0,

          onePointChecked: false,
          twoPointChecked: false,
        },
        {
          c_id: 0,
          name: "Jonas Pfeifer",
          class: "4AHIF",
          firstVotes: 0,
          points: 0,

          onePointChecked: false,
          twoPointChecked: false,
        },
        {
          c_id: 0,
          name: "Tobias Frischmann",
          class: "4AHIF",
          firstVotes: 0,
          points: 0,

          onePointChecked: false,
          twoPointChecked: false,
        },
      ];

      for (let candidate of cand) {
        this.addCandidate(candidate);
      }
    },
  },
});

function getCandidateWithHighestPoints(cands: Candidate[]) {
  if (cands.length === 0) return [];
  let max_points = cands
    .map((value) => value.points)
    .reduce((previousValue, currentValue) =>
      Math.max(previousValue, currentValue),
    );

  if (max_points === 0) return [];

  let winners: Candidate[] = [];

  for (let cand of cands) {
    if (cand.points === max_points) {
      winners.push(cand);
    }
  }

  if (winners.length == 1) return winners;

  let max_firstVotes = winners
    .map((value) => value.firstVotes)
    .reduce((previousValue, currentValue) =>
      Math.max(previousValue, currentValue),
    );

  winners = [];

  for (let cand of cands) {
    if (cand.firstVotes === max_firstVotes) {
      winners.push(cand);
    }
  }

  return winners
}
