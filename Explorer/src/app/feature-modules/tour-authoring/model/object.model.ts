export interface TourObject {
    id?: number;
    name: string;
    description: string;
    image: string;
    category: number;
    longitude: number;
    latitude: number;
    userId: number;
    publicStatus: Status;
  }

  export enum Status {
    PRIVATE = 0,
    REQUESTED_PUBLIC = 1,
    PUBLIC = 2
}