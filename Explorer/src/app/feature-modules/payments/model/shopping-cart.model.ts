import { OrderItem } from "./order-item.model";
import { TourPurchaseToken } from "../../payments/model/tour-purchase-token.model";

export interface ShoppingCart {
    id?:number;
    userId?: number;
    items: OrderItem[];
    purchaseTokens: TourPurchaseToken[];
    totalPrice: number;
}