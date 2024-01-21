import type {BallotPaper, Candidate} from "~/utils/Types";
import {afterEach, beforeEach, describe, expect, test} from "vitest";
import {useCandidateStore} from "~/store/CandidateStore";
import {useBallotPaperStore} from "~/store/BallotStore";
import _ballotPaperCandidateComponent from "../../components/BallotPaperCandidateComponent.vue";
import {mount} from "@vue/test-utils";

let candidate1: Candidate = {
    c_id: 1,
    name: "Benedikt Huff",
    class: "4AHIF",
    firstVotes: 1,
    points: 2,
    onePointChecked: false,
    twoPointChecked: false,
}

let candidate2: Candidate = {
    c_id: 2,
    name: "Jonas Pfeifer",
    class: "4AHIF",
    firstVotes: 0,
    points: 1,
    onePointChecked: false,
    twoPointChecked: false,
}


const candidateStore = useCandidateStore();
const ballotStore = useBallotPaperStore();

describe("ballotPaperTest", () => {
    beforeEach(() => {
        candidateStore.addCandidate(candidate1);
        candidateStore.addCandidate(candidate2);
        ballotStore.addBallotPaper(candidate2, candidate1);
    });

    afterEach(() => {
        candidateStore.$reset();
        // ballotStore.$reset();

        candidate1 = {
            c_id: 1,
            name: "Benedikt Huff",
            class: "4AHIF",
            firstVotes: 1,
            points: 2,
            onePointChecked: false,
            twoPointChecked: false,
        }

        candidate2 = {
            c_id: 2,
            name: "Jonas Pfeifer",
            class: "4AHIF",
            firstVotes: 0,
            points: 1,
            onePointChecked: false,
            twoPointChecked: false,
        }
    });

    test("setInvalid", async () => {
        expect(_ballotPaperCandidateComponent).toBeTruthy();

        let oldCandidate1 = JSON.parse(JSON.stringify(candidateStore.getByID(candidate1.c_id))) as Candidate
        let oldCandidate2 = JSON.parse(JSON.stringify(candidateStore.getByID(candidate2.c_id))) as Candidate

        const wrapper = mount(_ballotPaperCandidateComponent, {
            props: {data: ballotStore.ballotPapers[0], hideIrrelevantThings: false}
        });

        wrapper.vm.setPaperInvalid();

        expect(
            candidateStore.getByID(oldCandidate1.c_id)?.firstVotes
        ).toBe(oldCandidate1.firstVotes - 1)
        expect(
            candidateStore.getByID(oldCandidate1.c_id)?.points
        ).toBe(oldCandidate1.points - 2)

        expect(
            candidateStore.getByID(oldCandidate2.c_id)?.firstVotes
        ).toBe(oldCandidate2.firstVotes)
        expect(
            candidateStore.getByID(oldCandidate2.c_id)?.points
        ).toBe(oldCandidate2.points - 1)
    });

    test("change", async () => {
        expect(_ballotPaperCandidateComponent).toBeTruthy();

        let oldCandidate1 = JSON.parse(JSON.stringify(candidateStore.getByID(candidate1.c_id))) as Candidate
        let oldCandidate2 = JSON.parse(JSON.stringify(candidateStore.getByID(candidate2.c_id))) as Candidate

        const wrapper = mount(_ballotPaperCandidateComponent, {
            props: {data: ballotStore.ballotPapers[0], hideIrrelevantThings: false}
        });

        wrapper.vm.change(ballotStore.ballotPapers[0]);

        expect(
            candidateStore.getByID(oldCandidate1.c_id)?.firstVotes
        ).toBe(oldCandidate1.firstVotes - 1)
        expect(
            candidateStore.getByID(oldCandidate1.c_id)?.points
        ).toBe(oldCandidate1.points - 2)
        expect(
            candidateStore.getByID(oldCandidate1.c_id)?.twoPointChecked
        ).toBeTruthy();


        expect(
            candidateStore.getByID(oldCandidate2.c_id)?.firstVotes
        ).toBe(oldCandidate2.firstVotes)
        expect(
            candidateStore.getByID(oldCandidate2.c_id)?.points
        ).toBe(oldCandidate2.points - 1)
        expect(
            candidateStore.getByID(oldCandidate2.c_id)?.onePointChecked
        ).toBeTruthy();
    });

    test("noChangesWhenInvalid", async () => {
        expect(_ballotPaperCandidateComponent).toBeTruthy();

        let oldCandidate1 = JSON.parse(JSON.stringify(candidateStore.getByID(candidate1.c_id))) as Candidate
        let oldCandidate2 = JSON.parse(JSON.stringify(candidateStore.getByID(candidate2.c_id))) as Candidate

        const wrapper = mount(_ballotPaperCandidateComponent, {
            props: {data: ballotStore.ballotPapers[0], hideIrrelevantThings: false, changeAllowed: true}
        });

        ballotStore.ballotPapers[0].invalid = true;

        await wrapper.find("#invalidButton").trigger("click");
        await wrapper.find("#changeButton").trigger("click");

        expect(
            candidateStore.getByID(oldCandidate1.c_id)?.firstVotes
        ).toBe(oldCandidate1.firstVotes)
        expect(
            candidateStore.getByID(oldCandidate1.c_id)?.points
        ).toBe(oldCandidate1.points)

        expect(
            candidateStore.getByID(oldCandidate2.c_id)?.firstVotes
        ).toBe(oldCandidate2.firstVotes)
        expect(
            candidateStore.getByID(oldCandidate2.c_id)?.points
        ).toBe(oldCandidate2.points)
    });

    test("noChangesWhenChangeNotAllowed", async () => {
        expect(_ballotPaperCandidateComponent).toBeTruthy();

        let oldCandidate1 = JSON.parse(JSON.stringify(candidateStore.getByID(candidate1.c_id))) as Candidate
        let oldCandidate2 = JSON.parse(JSON.stringify(candidateStore.getByID(candidate2.c_id))) as Candidate

        const wrapper = mount(_ballotPaperCandidateComponent, {
            props: {data: ballotStore.ballotPapers[0], hideIrrelevantThings: false, changeAllowed: false}
        });


        await wrapper.find("#invalidButton").trigger("click");
        await wrapper.find("#changeButton").trigger("click");

        expect(
            candidateStore.getByID(oldCandidate1.c_id)?.firstVotes
        ).toBe(oldCandidate1.firstVotes)
        expect(
            candidateStore.getByID(oldCandidate1.c_id)?.points
        ).toBe(oldCandidate1.points)

        expect(
            candidateStore.getByID(oldCandidate2.c_id)?.firstVotes
        ).toBe(oldCandidate2.firstVotes)
        expect(
            candidateStore.getByID(oldCandidate2.c_id)?.points
        ).toBe(oldCandidate2.points)
    })
})

