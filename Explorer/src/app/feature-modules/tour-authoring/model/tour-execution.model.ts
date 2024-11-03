export interface TourExecution {
    id?: number;
    tourId: number;
    touristId: number;
    locationId?: number;
    lastActivicy?: Date;
    status: number;
    completedKeyPoints?: CompletedKeyPoint[];
}

export class CompletedKeyPoint{
    keyPointId: number;
    completionTime: Date;
  }