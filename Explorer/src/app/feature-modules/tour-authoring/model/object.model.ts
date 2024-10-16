export interface TourObject {
    id?: number;
    name: string;
    description: string;
    image: string;
    category: string;
    longitude: number;
    latitude: number;
    userId: number;
  }

export enum ObjectCategory {
    WC = 'WC',
    Restaurant = 'Restaurant',
    Parking = 'Parking',
    Other = 'Other'
}
