export interface TourPurchaseToken{
    id?: number;
    userId: number;
    cartId: number;
    tourId: number;
    purchaseDate: Date;
    orderId: number;
}