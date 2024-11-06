export interface KeyPoint {
    id?: number;
    name: string;
    longitude: number;
    latitude: number;
    description: string;
    image: string;
    userId: number;
    imageBase64: string;
    tourId: number;
    publicStatus: Status;
}
export enum Status {
    PRIVATE = 0,
    REQUESTED_PUBLIC = 1,
    PUBLIC = 2
}