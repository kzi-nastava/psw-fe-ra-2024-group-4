export interface Post{
    id?:number,
    title: string,
    description: string,
    createdAt:Date,
    imageUrl?: string,
    status: BlogStatus,
    userId: number,
    imageBase64: string
}
export enum BlogStatus{
    Draft=0,
    Published=1,
    Closed=2
}