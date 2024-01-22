import { afterEach, describe, expect, test } from "vitest";
import _candidateComponentForVoting from "../../components/CandidateComponentForVoting.vue";
import { mount } from "@vue/test-utils";
import type { Candidate } from "~/utils/Types";

let candidate: Candidate = {
  c_id: 1,
  name: "Jonas Pfeifer",
  class: "4AHIF",
  points: 0,
  firstVotes: 0,
  onePointChecked: false,
  twoPointChecked: false,
};

describe("voting_candidate_component_test", () => {
  afterEach(() => {
    candidate = {
      c_id: 1,
      name: "Jonas Pfeifer",
      class: "4AHIF",
      points: 0,
      firstVotes: 0,
      onePointChecked: false,
      twoPointChecked: false,
    };
  });

  test("emitting_event_whenClicked_onFirstVote", async () => {
    expect(_candidateComponentForVoting).toBeTruthy();

    const wrapper = mount(_candidateComponentForVoting, {
      props: {
        candidate: candidate,
        twoPointsDisabled: false,
        onePointDisabled: false,
        bothClickable: false,
      },
    });

    await wrapper.vm.clickedOnTwoPoints();

    expect(wrapper.emitted().selected2).toBeDefined();
  });

  test("emitting_event_whenClicked_onSecondVote", async () => {
    expect(_candidateComponentForVoting).toBeTruthy();

    const wrapper = mount(_candidateComponentForVoting, {
      props: {
        candidate: candidate,
        twoPointsDisabled: false,
        onePointDisabled: false,
        bothClickable: false,
      },
    });

    await wrapper.vm.clickedOnOnePoint();

    expect(wrapper.emitted().selected1).toBeDefined();
  });

  test("secondVoteButtonDisabledWhenTwoPointsDisabled", async () => {
    expect(_candidateComponentForVoting).toBeTruthy();

    const wrapper = mount(_candidateComponentForVoting, {
      props: {
        candidate: candidate,
        twoPointsDisabled: true,
        onePointDisabled: false,
        bothClickable: false,
      },
    });

    // @ts-ignore
    expect(wrapper.find("#firstVote").element.disabled).toBeTruthy();
  });

  test("firstVoteButtonDisabledWhenOnePointDisabled", async () => {
    expect(_candidateComponentForVoting).toBeTruthy();

    const wrapper = mount(_candidateComponentForVoting, {
      props: {
        candidate: candidate,
        twoPointsDisabled: false,
        onePointDisabled: true,
        bothClickable: false,
      },
    });

    // @ts-ignore
    expect(wrapper.find("#secondVote").element.disabled).toBeTruthy();
  });

  test("firstVoteDisabledWhenSecondVoteChecked", async () => {
    expect(_candidateComponentForVoting).toBeTruthy();

    const wrapper = mount(_candidateComponentForVoting, {
      props: {
        candidate: candidate,
        twoPointsDisabled: true,
        onePointDisabled: false,
        bothClickable: false,
      },
    });

    await wrapper.find("#secondVote").trigger("click");

    // @ts-ignore
    expect(wrapper.find("#firstVote").element.disabled).toBeTruthy();
  });

  test("secondVoteDisabledWhenFirstVoteChecked", async () => {
    expect(_candidateComponentForVoting).toBeTruthy();

    const wrapper = mount(_candidateComponentForVoting, {
      props: {
        candidate: candidate,
        twoPointsDisabled: false,
        onePointDisabled: true,
        bothClickable: false,
      },
    });

    await wrapper.find("#firstVote").trigger("click");

    // @ts-ignore
    expect(wrapper.find("#secondVote").element.disabled).toBeTruthy();
  });
});
