import { Equipment } from "./equipment.model";

export interface PersonInfo {
    id: number;
    userId: number;
    name: string;
    surname: string;
    profilePicture: string;
    biography: string;
    motto: string;
    equipment: number[];
}
