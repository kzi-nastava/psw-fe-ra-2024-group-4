import { TourOverview } from "./touroverview.model";

export interface Bundle {
    id?: number;
    name: string;
    price: number;
    status: Status;
    authorId: number;
    tourIds: number[];
    tours: TourOverview[];
    canBePublished?: boolean;
}

export enum Status {
    DRAFT=0,
    PUBLISHED=1,
    ARCHIVED=2
}