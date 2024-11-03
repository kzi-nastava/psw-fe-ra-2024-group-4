export interface TourExecution {
    id?: number;
    tourId: number;
    touristId?: number;
    locationId?: number;
    lastActivicy?: Date;
    status: number;
    completedKeys?: CompletedKeys[];
}

export class CompletedKeys{
    keyPointId: number;
    completionTime: Date;
  }