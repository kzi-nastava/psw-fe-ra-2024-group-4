export enum EncounterStatus {
    Active =0,
    Draft =1,
    Archived =2,
  }
  
  export enum EncounterType {
    Social = 0,
    HiddenLocation = 1,
    Misc = 2,
  }
  
  export interface SocialDataDto {
    requiredParticipants: number ;
    radius: number;     
  }
  
  export interface HiddenLocationDataDto {
    imageUrl: string;
    imageBase64: string;
    activationRadius: number;
    latitude: number;
    longitude: number;
  }
  
  export interface MiscDataDto {
    actionDescription: string;  
  }
  
  export interface Encounter {
    id?: number;      
    title: string;            
    description: string;
    latitude: number;          
    longitude: number;      
    xp: number;               
    status: EncounterStatus;    
    type: EncounterType;        
    socialData: SocialDataDto | null;  
    hiddenLocationData: HiddenLocationDataDto | null; 
    miscData: MiscDataDto | null;     
    instances?: EncounterInstance[] | null; 
    data? : string
  }
  
  export interface EncounterInstance {
    userId: number; 
    status: EncounterInstanceStatus; 
    completionTime?: Date; 
  }
  
  export enum EncounterInstanceStatus {
    Active = 0,
    Completed = 1,
  }
  