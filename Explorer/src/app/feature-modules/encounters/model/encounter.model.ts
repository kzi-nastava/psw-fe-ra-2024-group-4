export enum EncounterStatus {
    Active = "Active",
    Draft = "Draft",
    Archived = "Archived",
  }
  
  export enum EncounterType {
    Social = "Social",
    HiddenLocation = "HiddenLocation",
    Misc = "Misc",
  }
  
  export interface SocialDataDto {
    requiredParticipants: number ;
    radius: number;     
  }
  
  export interface HiddenLocationDataDto {
    imageUrl: string;   
    activationRadius: number;   
  }
  
  export interface MiscDataDto {
    actionDescription: string;  
  }
  
  export interface Encounter {
    id: number;      
    title: string;            
    description: string;
    latitude: number;          
    longitude: number;      
    xp: number;               
    status: EncounterStatus;    
    type: EncounterType;  
    data?: any;                  
    socialData: SocialDataDto | null;  
    hiddenLocationData: HiddenLocationDataDto | null; 
    miscData: MiscDataDto | null;      
  }
  