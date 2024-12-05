import { Tour } from "../../tour-authoring/model/tour.model";
import { TourOverview } from "../../tour-authoring/model/touroverview.model";

export interface Sale {
    id?: number; 
    tourIds: number[];
    startDate: Date;
    endDate: Date; 
    discountPercentage: number; 
    authorId: number,
    tourDetails?: Tour[];
    tourOverview?:TourOverview[];
  }
  