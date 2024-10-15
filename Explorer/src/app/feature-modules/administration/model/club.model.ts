export interface Club{
    id?:number,
    name:string,
    description:string,
    image:string,
    userId?:number,
    userIds: number[] | null; 

}