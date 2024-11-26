import { Tour } from "../../tour-authoring/model/tour.model";

export interface Sale {
    id?: number; 
    tourIds: number[];
    startDate: Date;
    endDate: Date; 
    discountPercentage: number; 
    authorId: number,
    tourDetails?: Tour[];
  }
  