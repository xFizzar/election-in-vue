export interface Candidate{
    c_id: number;

    name: string;
    klasse: string;
    punkte: number;
    platz1: number;

    onePointChecked: boolean;
    twoPointChecked: boolean;
}

export interface CandidateData{
    name: string;
    klasse: string;
}