import {defineStore} from "pinia"
import type {BallotPaper} from "~/utils/BallotPaper";
import type {Candidate} from "~/utils/Candidate";

interface State {
    current_id: number;
    ballotPapers: BallotPaper[];
}

export const useBallotPaperStore = defineStore("ballotPapers", {
    state: (): State => ({
        current_id: 1,
        ballotPapers: [],
    }),
    actions: {
        addBallotPaper(firstCandidate: Candidate | undefined, secondCandidate: Candidate | undefined) {
            this.ballotPapers.push({
                id: this.current_id,
                number: 1 + getValidPapers(this.ballotPapers).length,
                firstCandidate: firstCandidate,
                secondCandidate: secondCandidate,

                invalid: false,
            })
            this.current_id++;

        },
        deleteBallotPaper(paper: BallotPaper) {
            this.ballotPapers.splice(this.ballotPapers.indexOf(paper));
        }
    }
})

function getValidPapers(papers: BallotPaper[]) {
    return papers.filter(value => !value.invalid);
}