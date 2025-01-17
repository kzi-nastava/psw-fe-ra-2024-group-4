export interface PaymentRecord {
    id?:number;
    bundleId?: number;
    touristId?: number;
    price: number;
    date: Date;
}