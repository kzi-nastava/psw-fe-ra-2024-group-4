import { Tour } from "./tour.model";

export interface OrderItem{
    id?: number;
    tourName: string;
    price: number;
    tourId: number;
    cartId: number;
    tourDetails?: Tour;
}