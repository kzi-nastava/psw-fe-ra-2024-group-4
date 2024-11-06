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
    status: number;
}