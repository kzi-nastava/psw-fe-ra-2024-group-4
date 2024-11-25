export interface Bundle {
    id?: number;
    name: string;
    price: number;
    status: Status;
    authorId: number;
    tourIds: number[]; 
}

export enum Status {
    DRAFT=0,
    PUBLISHED=1,
    ARCHIVED=2
}