import { KeyPoint } from "./keypoint.model";

export interface Tour {
    id?: number;
    name: string;
    description: string;
    difficulty: string;
    tags: number[]; 
    status: number; 
    price: number;
    userId: number;
    equipmentIds: number[] | null; 
    keyPointIds: number[] | null; 
    keyPoints: KeyPoint[];
  }