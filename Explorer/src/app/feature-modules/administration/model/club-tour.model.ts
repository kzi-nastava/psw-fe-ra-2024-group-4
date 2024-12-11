export interface ClubTour{
    id?: number;
    clubId: number;
    tourId: number;
    date: Date;
    discount: number;
    username? : string;
    touristIds: number[];
    title? : string;
    description? : string;
    price? : number;
    difficulty?: string;
    tags?: string[]; 
    lengthInKm?: number;
}
