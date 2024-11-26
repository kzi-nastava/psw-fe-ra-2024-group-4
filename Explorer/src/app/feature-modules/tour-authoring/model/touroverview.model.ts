import { TourReview } from "../../marketplace/model/tour-reviews.model";
import { KeyPoint } from "./keypoint.model";

export interface TourOverview {
    tourId: number;
    tourName: string;
    tourDescription: string;
    tourDifficulty: number;
    tags: string[];
    firstKeyPoint: KeyPoint;
    reviews?: TourReview[];
    rating?: number;
    price?: number;
    discountedPrice?: number;
    originalPrice?: number; 
}