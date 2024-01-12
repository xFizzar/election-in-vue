import type {Candidate} from "~/utils/Candidate";

export interface BallotPaper {

    id: number;
    number: number;

    firstCandidate: Candidate | undefined;
    secondCandidate: Candidate | undefined;

    invalid: boolean;

}