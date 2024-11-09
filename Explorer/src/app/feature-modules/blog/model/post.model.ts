import { Comment } from '../model/comment.model'; //mora da se importuje jer se koristi ovde :3
import {Rating} from '../model/rating.model'
export interface Post{
    id?:number,
    title: string,
    description: string,
    createdAt:Date,
    imageUrl?: string,
    status: BlogStatus,
    userId: number,
    ratingSum: number
    imageBase64: string,
    comments: Comment[],
    ratings: Rating[]
}
export enum BlogStatus{
    Draft=0,
    Published=1,
    Closed=2,
    Active=3,
    Famous=4
}