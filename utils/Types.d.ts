export interface Candidate {
    c_id: number;

    name: string;
    class: string;
    points: number;
    firstVotes: number;

    onePointChecked: boolean;
    twoPointChecked: boolean;
}

export interface CandidateData {
    name: string;
    class: string;
}

export interface BallotPaper {

    id: number;
    number: number;

    firstCandidate: Candidate | undefined;
    secondCandidate: Candidate | undefined;

    invalid: boolean;

}