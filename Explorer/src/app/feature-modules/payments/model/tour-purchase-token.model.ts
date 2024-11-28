export interface TourPurchaseToken{
    id?: number;
    userId: number;
    cartId?: number;
    tourId: number;
    price: number;
    purchaseDate: Date;
}