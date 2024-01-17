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
        invalid_candidate: {c_id: 0, name: "ungültig", klasse: "", twoPointChecked: false, onePointChecked: false, punkte: 0, platz1: 0},
    }),
    actions: {
        addCandidate(candidate: Candidate) {
            if (candidate == undefined) return;
            candidate.c_id = this.current_id;
            this.current_id++;
            this.candidates.push(candidate);
        },
        deleteCandidate(candidate: Candidate) {
            this.candidates.splice(this.candidates.indexOf(candidate), 1);
        },

        addExampleCandidate() {
            let cand: Candidate[] = [
                {
                    c_id: 0,
                    name: "Fabian Götz",
                    klasse: "4AHIF",
                    platz1: 0,
                    punkte: 0,

                    onePointChecked: false,
                    twoPointChecked: false,
                },
                {
                    c_id: 0,
                    name: "Benedikt Huff",
                    klasse: "4AHIF",
                    platz1: 0,
                    punkte: 0,

                    onePointChecked: false,
                    twoPointChecked: false,
                },
                {
                    c_id: 0,
                    name: "Jonas Pfeifer",
                    klasse: "4AHIF",
                    platz1: 0,
                    punkte: 0,

                    onePointChecked: false,
                    twoPointChecked: false,
                },
                {
                    c_id: 0,
                    name: "Tobias Frischmann",
                    klasse: "4AHIF",
                    platz1: 0,
                    punkte: 0,

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
