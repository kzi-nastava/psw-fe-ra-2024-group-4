export interface Comment {
    
  id?: number;   
  text: string;     
  postId: number;   
  userId?: number; 
  createdAt?: string;  
  updatedAt?: string; 
  username: string;
}