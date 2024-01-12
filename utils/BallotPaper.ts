import type {Candidate} from "~/utils/Candidate";

export interface BallotPaper {

    id: number;

    firstCandidate: Candidate | undefined;
    secondCandidate: Candidate | undefined;

}