import { TourOverview } from "./touroverview.model";

export interface Bundle {
    id?: number;
    name: string;
    price: number;
    status: Status;
    authorId: number;
    tourIds: number[];
    tours: TourOverview[];
}

export enum Status {
    DRAFT=0,
    PUBLISHED=1,
    ARCHIVED=2
}