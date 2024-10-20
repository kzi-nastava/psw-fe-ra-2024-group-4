export interface Post{
    id?:number,
    title: string,
    description: string,
    createdAt:Date,
    imageUrl?: string,
    status: Status,
    userId: number
}
export enum Status{
    Draft=0,
    Published=1,
    Closed=2
}