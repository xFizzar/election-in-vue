import {defineStore} from "pinia"
import type {BallotPaper, Candidate} from "~/utils/Types";

interface State {
    current_id: number;
    ballotPapers: BallotPaper[];
}

export const useBallotPaperStore = defineStore("ballotPapers", {
    state: (): State => ({
        current_id: 1,
        ballotPapers: [],
    }),
    getters: {
        getValidVoteCount: state => getValidPapers(state.ballotPapers).length,
        getTotalVoteCount: state => state.ballotPapers.length,
        getReversedBallotPapers: state => [...state.ballotPapers].reverse()
    },
    actions: {
        addBallotPaper(firstCandidate: Candidate | undefined, secondCandidate: Candidate | undefined): BallotPaper {
            const ballotPaper = {
                id: this.current_id,
                number: 1 + getValidPapers(this.ballotPapers).length,
                firstCandidate: firstCandidate,
                secondCandidate: secondCandidate,

                invalid: false,
            }
            this.ballotPapers.push(ballotPaper)
            this.current_id++;

            return ballotPaper;

        },
        deleteBallotPaper(paper: BallotPaper) {
            this.ballotPapers.splice(this.ballotPapers.indexOf(paper));
        }
    }
})

function getValidPapers(papers: BallotPaper[]) {
    return papers.filter(value => !value.invalid);
}