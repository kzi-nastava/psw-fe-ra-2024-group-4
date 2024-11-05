import { Comment } from '../model/comment.model'; //mora da se importuje jer se koristi ovde :3
export interface Post{
    id?:number,
    title: string,
    description: string,
    createdAt:Date,
    imageUrl?: string,
    status: BlogStatus,
    userId: number,
    imageBase64: string,
    comments: Comment[]
}
export enum BlogStatus{
    Draft=0,
    Published=1,
    Closed=2
}