export interface Problem{
    id: number,
    userId: number,
    tourId: number,
    description: string,
    category: string,
    priority: number,
    time: Date
}