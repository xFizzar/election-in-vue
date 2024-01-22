import { mount } from "@vue/test-utils";
import _importSettingsComponent from "../../components/ImportSettingsComponent.vue";
import { describe, expect, test, afterEach } from "vitest";
import type { Candidate } from "~/utils/Types";
import { useCandidateStore } from "~/store/CandidateStore";

const candidateStore = useCandidateStore();

describe("importComponent_tests", () => {
  afterEach(() => {
    candidateStore.$reset();
  });
  test("buttonDisabledWhenNotAllFilesSelected", () => {
    expect(_importSettingsComponent).toBeTruthy();

    const wrapper = mount(_importSettingsComponent);

    // @ts-ignore
    expect(wrapper.find("#import").element.disabled).toBeTruthy();
  });

  test("restoreFromLocalStorage", () => {
    expect(_importSettingsComponent).toBeTruthy();

    localStorage.setItem(
      "candidates",
      JSON.stringify([
        {
          c_id: 0,
          name: "Benedikt Huff",
          class: "4AHIF",
          firstVotes: 0,
          points: 0,
          onePointChecked: false,
          twoPointChecked: false,
        } as Candidate,
      ]),
    );
    localStorage.setItem("ballots", JSON.stringify([{}]));
    localStorage.setItem("invalid_candidate", JSON.stringify({}));

    const wrapper = mount(_importSettingsComponent);

    wrapper.vm.restore();

    expect(candidateStore.candidates.length).toBeGreaterThanOrEqual(1);
  });
});
