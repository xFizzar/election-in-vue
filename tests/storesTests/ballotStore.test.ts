import { afterEach, describe, expect, test } from "vitest";
import type { Candidate } from "~/utils/Types";
import { useBallotPaperStore } from "~/store/BallotStore";

const ballotStore = useBallotPaperStore();

const candidate1: Candidate = {
  c_id: 4,
  name: "Jonas Pfeifer",
  class: "4AHIF",
  firstVotes: 0,
  points: 0,
  onePointChecked: false,
  twoPointChecked: false,
};
const candidate2: Candidate = {
  c_id: 2,
  name: "Benedikt Huff",
  class: "4AHIF",
  firstVotes: 0,
  points: 0,
  onePointChecked: false,
  twoPointChecked: false,
};

describe("ballotStoreTest", () => {
  afterEach(() => {
    ballotStore.$reset();
  });

  test("addBallotPaper working", () => {
    ballotStore.addBallotPaper(candidate1, candidate2);

    expect(ballotStore.ballotPapers.length).toEqual(1);
  });

  test("getTotalVoteCount working", () => {
    ballotStore.addBallotPaper(candidate1, candidate2);

    expect(ballotStore.getTotalVoteCount).toEqual(1);
  });

  test("getValidVoteCount working", () => {
    ballotStore.addBallotPaper(candidate1, candidate2);

    expect(ballotStore.getValidVoteCount).toEqual(1);

    ballotStore.ballotPapers[0].invalid = true;

    expect(ballotStore.getValidVoteCount).toEqual(0);
  });
});
