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
    publicStatus: PublicStatus;
}
export enum PublicStatus {
    PRIVATE = 0,
    REQUESTED_PUBLIC = 1,
    PUBLIC = 2
}