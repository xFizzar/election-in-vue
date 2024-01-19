import {useCandidateStore} from "~/store/CandidateStore";
import {useBallotPaperStore} from "~/store/BallotStore";

export const useLocalStorage = defineStore("localStorage", {
    actions: {
        updateLocalStorage() {
            this.updateCandidates();
            this.updateBallots();
        },
        updateCandidates() {
            const candidatesAsString = JSON.stringify(useCandidateStore().candidates);
            const invalidAsString = JSON.stringify(useCandidateStore().invalid_candidate)
            localStorage.setItem("candidates", candidatesAsString);
            localStorage.setItem("invalid_candidate", invalidAsString);
        },
        updateBallots() {
            const ballotsPapersAsString = JSON.stringify(
                useBallotPaperStore().ballotPapers,
            );
            localStorage.setItem("ballots", ballotsPapersAsString);
        },
    },
});