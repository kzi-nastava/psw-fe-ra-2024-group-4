export interface ClubInvitation{
    id?: number;
    ownerId: number;
    memberId: number;
    clubId: number;
    status: string;
}