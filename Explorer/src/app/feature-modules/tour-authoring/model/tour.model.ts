export interface Tour {
    id?: number;
    name: string;
    description: string;
    difficulty: string;
    tags: number[]; 
    status: number; 
    price: number;
    userId: number;
    lengthInKm: number;
    publishedTime?: Date;
    archiveTime?: Date;
    equipmentIds: number[] | null; 
    keyPointIds: number[] | null; 
  }