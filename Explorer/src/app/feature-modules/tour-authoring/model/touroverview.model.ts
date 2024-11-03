import { TourReview } from "../../marketplace/model/tour-reviews.model";
import { KeyPoint } from "./keypoint.model";

export interface TourOverview {
    id?: number;
    name?: string;
    imgUrl?: string;
    description?: string;
    difficulty?: number;
    tags?: string[];
    firstkeypoint?: KeyPoint;
    reviews?: TourReview[];
    rating?: number;
}