import type {Candidate} from "~/utils/Types";
import {afterEach, describe, test, expect} from "vitest";
import _candidateComponent from "../../components/CandidateComponent.vue";
import {mount} from "@vue/test-utils";

let candidate1: Candidate = {
    c_id: 0,
    name: "Benedikt Huff",
    class: "4AHIF",
    firstVotes: 0,
    points: 0,
    onePointChecked: false,
    twoPointChecked: false,
}

describe("addCandidate test", () => {
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
    });

    test("add_candidate", async () => {
        expect(_candidateComponent).toBeTruthy();

        const wrapper = mount(_candidateComponent, {
            props: {
                candidate: candidate1, twoPointsDisabled: false,
                onePointDisabled: false,
                showDeleteButton: true,
                bothClickable: false,
                hideVotingOptions: false,
                hidePoints: false,
            },
        });

        wrapper.vm.deleteCandidate();

        const candidates: Candidate[] = wrapper.emitted().delete[0] as Candidate[];

        expect(candidates[0].name).toEqual("Benedikt Huff");
    });

})