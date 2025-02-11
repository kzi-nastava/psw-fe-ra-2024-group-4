export interface TourExecution {
    id?: number;
    tourId: number;
    touristId?: number;
    locationId?: number;
    lastActivity?: Date;
    status: number;
    completedKeys?: CompletedKeys[];
}

export class CompletedKeys{
    keyPointId: number | undefined;
    completionTime: Date | undefined;
  }