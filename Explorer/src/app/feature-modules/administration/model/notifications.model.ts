export interface Notification{
    id: number;
    description: string;
    creationTime: Date;
    isRead: boolean;
    userId: number;
    notificationsType: number; 
    resourceId: number; 
}
