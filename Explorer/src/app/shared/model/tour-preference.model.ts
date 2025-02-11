export enum TransportMode {
    Walking = 0,
    Bike = 1,
    Car = 2,
    Boat = 3
  }
  
  export interface TourPreference {
    id?: number;
    touristId: number;
    weightPreference: number;
    walkingRating: number;
    bikeRating: number;
    carRating: number;
    boatRating: number;
    tags: number[];
  }
  