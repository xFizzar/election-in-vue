import {defineStore} from "pinia";
import type {Candidate} from "~/utils/Types";


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
            firstVotes: 0
        },
    }),
    actions: {
        getByID(id: number): Candidate | undefined {
            if (id == 0) return this.invalid_candidate;
            return this.candidates.find(value => value.c_id == id);
        },
        addCandidate(candidate: Candidate) {
            if (candidate == undefined) return;
            candidate.c_id = this.current_id;
            this.current_id++;
            this.candidates.push(candidate);
        },
        deleteCandidate(candidate: Candidate): Candidate {
            return this.candidates.splice(this.candidates.indexOf(candidate), 1) as unknown as Candidate;
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
            ]

            for (let candidate of cand) {
                this.addCandidate(candidate);
            }
        }
    },
});
