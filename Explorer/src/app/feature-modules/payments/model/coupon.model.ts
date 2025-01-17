export interface Coupon{
    id?:number,
    discountPercentage:number,
    promoCode?:string,
    expirationDate?:Date | null
    tourId?:number,
    authorId:number
}