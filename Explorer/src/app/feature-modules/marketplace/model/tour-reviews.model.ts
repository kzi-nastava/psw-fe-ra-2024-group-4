export interface tourReview{
    id: number,
    idTour: number,
    idTourist: number,
    rating: number,
    comment: string,
    dateTour: Date,
    dateComment: Date,
    images: []
}