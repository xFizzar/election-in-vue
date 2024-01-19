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
        getReversedBallotPapers: state => [...state.ballotPapers].reverse(),
        getMaxNumber: state => {
            if (state.ballotPapers.length == 0) return 0;
            return state.ballotPapers.map((v) => v.number).reduce((oldv, newv) => {
                return newv > oldv ? newv : oldv;
            })
        },
    },
    actions: {
        addBallotPaper(firstCandidate: Candidate | undefined, secondCandidate: Candidate | undefined, number: number | undefined = undefined): BallotPaper {
            const ballotPaper = {
                id: this.current_id,
                number: number === undefined ? 1 + this.getMaxNumber : number,
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