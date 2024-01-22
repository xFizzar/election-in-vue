import type {Candidate} from "~/utils/Types";
import {afterEach, describe, test, expect, beforeEach} from "vitest";
import _candidateComponentForCreation from "../../components/CandidateComponentForCreation.vue";
import {mount} from "@vue/test-utils";
import {useCandidateStore} from "~/store/CandidateStore";

let candidate1: Candidate = {
    c_id: 0,
    name: "Benedikt Huff",
    class: "4AHIF",
    firstVotes: 0,
    points: 0,
    onePointChecked: false,
    twoPointChecked: false,
}

const candidateStore = useCandidateStore();

describe("deleteCandidate test", () => {
    beforeEach(() => {
        candidateStore.addCandidate(candidate1);
    });

    afterEach(() => {
        candidate1 = {
            c_id: 0,
            name: "Benedikt Huff",
            class: "4AHIF",
            firstVotes: 0,
            points: 0,
            onePointChecked: false,
            twoPointChecked: false,
        }
        candidateStore.$reset();
    });

    test("delete_candidate", async () => {
        expect(_candidateComponentForCreation).toBeTruthy();

        const wrapper = mount(_candidateComponentForCreation, {
            props: {
                candidate: candidate1,
            },
        });

        wrapper.vm.deleteCandidate();

        expect(candidateStore.candidates.length).toBe(0);
    });

})