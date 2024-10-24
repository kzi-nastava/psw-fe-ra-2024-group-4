import { Equipment } from "./equipment.model";

export interface PersonInfo {
    id: number;
    userId: number;
    name: string;
    surname: string;
    imageUrl: string;
    biography: string;
    motto: string;
<<<<<<< Updated upstream
    equipment: number[];
=======
    imageBase64: string;
>>>>>>> Stashed changes
}
