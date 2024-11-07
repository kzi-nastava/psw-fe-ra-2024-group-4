export interface TourOverviewReview {
    id?: number,
    tourId: number,
    userId: number,
    username?: string,
    userAvatar?: string,
    comment: string,
    rating: number
}