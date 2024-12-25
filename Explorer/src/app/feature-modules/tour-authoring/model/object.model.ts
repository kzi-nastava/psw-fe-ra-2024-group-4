export interface TourObject {
    id?: number;
    name: string;
    description: string;
    image: string;
    imageBase64?: string;
    category: number;
    longitude: number;
    latitude: number;
    userId: number;
    publicStatus: PublicStatus;
  }

  export enum PublicStatus {
    PRIVATE = 0,
    REQUESTED_PUBLIC = 1,
    PUBLIC = 2
}