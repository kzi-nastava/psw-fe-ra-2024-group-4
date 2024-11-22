
export interface PersonInfo {
    id: number;
    userId: number;
    name: string;
    surname: string;
    imageUrl: string;
    biography?: string;
    motto?: string;
    imageBase64?: string;
    equipment: number[];
    wallet: number
}
