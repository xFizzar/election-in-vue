import { afterEach, describe, expect, test } from "vitest";
import { useCandidateStore } from "~/store/CandidateStore";
import type { Candidate } from "~/utils/Types";

const candidateStore = useCandidateStore();

let candidate: Candidate = {
  c_id: 4,
  name: "Jonas Pfeifer",
  class: "4AHIF",
  firstVotes: 0,
  points: 0,
  onePointChecked: false,
  twoPointChecked: false,
};
let candidate2: Candidate = {
  c_id: 4,
  name: "Tobias Frischmann",
  class: "4AHIF",
  firstVotes: 1,
  points: 4,
  onePointChecked: false,
  twoPointChecked: false,
};

describe("candidateStoreTest", () => {
  afterEach(() => {
    candidateStore.$reset();

    candidate = {
      c_id: 4,
      name: "Jonas Pfeifer",
      class: "4AHIF",
      firstVotes: 0,
      points: 0,
      onePointChecked: false,
      twoPointChecked: false,
    };
  });

  test("candidateStoreEmptyFromStart", () => {
    expect(candidateStore.candidates.length).toBe(0);
  });

  test("addCandidate working", () => {
    candidateStore.addCandidate(candidate);

    expect(candidateStore.candidates.length).toBeGreaterThan(0);
    expect(candidateStore.candidates[0].name).toEqual("Jonas Pfeifer");
  });

  test("addCandidate sets right ID", () => {
    candidateStore.addCandidate(candidate);
    expect(candidateStore.candidates[0].c_id).toEqual(1);
    expect(candidateStore.current_id).toEqual(2);
  });

  test("deleteCandidate working", () => {
    candidateStore.addCandidate(candidate);
    expect(candidateStore.candidates.length).toBeGreaterThan(0);

    candidateStore.deleteCandidate(candidate);
    expect(candidateStore.candidates.length).toBe(0);
  });

  test("getByID returns invalid Candidate when ID is 0", () => {
    const invalidCand = candidateStore.getByID(0);

    expect(invalidCand).toEqual(candidateStore.invalid_candidate);
  });

  test("getByID working", () => {
    candidateStore.addCandidate(candidate);

    expect(candidateStore.getByID(1)?.name).toEqual("Jonas Pfeifer");
  });

  test("addExampleCandidate working", () => {
    candidateStore.addExampleCandidate();

    expect(candidateStore.candidates.length).toEqual(4);
  });

  test("getWinner working", () => {
    candidate.points = 2;
    candidateStore.addCandidate(candidate);

    expect(candidateStore.getWinner.length).toEqual(1);
    expect(candidateStore.getWinner[0].name).toEqual("Jonas Pfeifer");
  });

  test("getWinner returns empty array when no winner", () => {
    candidateStore.addExampleCandidate();
    candidateStore.addCandidate(candidate);

    expect(candidateStore.getWinner.length).toEqual(0);
  });

  test("getWinner returns correct winner if points are the same but firstVotes not", () => {
    candidate.points = 4;
    candidate.firstVotes = 2;

    candidateStore.addCandidate(candidate);
    candidateStore.addCandidate(candidate2);

    expect(candidateStore.getWinner.length).toEqual(1);
    expect(candidateStore.getWinner[0].name).toEqual("Jonas Pfeifer");
  });

  test("getWinner can return multiple winners", () => {
    candidate.points = 4;
    candidate.firstVotes = 1;

    candidateStore.addCandidate(candidate);
    candidateStore.addCandidate(candidate2);

    expect(candidateStore.getWinner.length).toEqual(2);
  });
});
